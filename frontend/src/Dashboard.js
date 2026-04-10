import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import api from "./api";

import LogsList from "./LogsList";
import DailyLog from "./DailyLog";
import Co2Chart from "./Co2Chart";
import HeatmapCalendar from "./HeatmapCalendar";

function Dashboard({ onLogout }) {

  const [stats, setStats] = useState({
    total_co2: 0,
    avg_daily: 0,
    min_daily: 0,
    max_daily: 0,
  });
  const [activePage, setActivePage]     = useState("dashboard");
  const [darkMode, setDarkMode]         = useState(true);
  const [showDailyLog, setShowDailyLog] = useState(false);
  const [streak, setStreak]             = useState({ current: 0, best: 0 });
  const [prediction, setPrediction]     = useState(null);
  const [predLoading, setPredLoading]   = useState(false);

  const predictFuture = async () => {
    setPredLoading(true);
    try {
      const res = await api.post("/api/predict", {});
      setPrediction(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Prediction failed — add at least 1 daily log first.";
      alert(msg);
    } finally {
      setPredLoading(false);
    }
  };

  useEffect(() => {
    api.get("/api/stats").then((res) => setStats(res.data || {}));
  }, []);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("carbon_streak"));
    if (s) setStreak(s);
  }, [activePage]);

  const navPages = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "logs",      icon: "≡", label: "Logs"      },
    { id: "heatmap",   icon: "⊞", label: "Calendar"  },
  ];

  // dark mode = no extra class (dark is default CSS)
  // light mode = adds .light which overrides all tokens
  const modeClass = darkMode ? "" : "light";

  return (
    <div className={`dash-container ${modeClass}`}>

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-top">

          <div className="dash-logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">EcoTrack</span>
          </div>

          <nav className="nav-links">
            {navPages.map((p) => (
              <button
                key={p.id}
                className={`nav-item ${activePage === p.id ? "active" : ""}`}
                onClick={() => setActivePage(p.id)}
              >
                <span className="nav-icon">{p.icon}</span>
                <span className="nav-label">{p.label}</span>
              </button>
            ))}
          </nav>

          <button
            className="predict-btn"
            onClick={predictFuture}
            disabled={predLoading}
          >
            <span>🔮</span>
            <span>{predLoading ? "Calculating..." : "Predict Tomorrow"}</span>
          </button>

        </div>

        <div className="sidebar-bottom">

          {/* ── THEME TOGGLE ── */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="toggle-track">
              <span className={`toggle-thumb ${darkMode ? "dark-thumb" : "light-thumb"}`} />
            </span>
            <span className="toggle-label">
              {darkMode ? "🌙 Dark Mode" : "🌿 Light Mode"}
            </span>
          </button>

          <button className="logout-btn" onClick={onLogout}>
            <span>⎋</span> Logout
          </button>

        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="dash-main-fixed">

        {/* ════ DASHBOARD ════ */}
        {activePage === "dashboard" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="welcome-title">Welcome Back 👋</h1>
                <p className="welcome-subtitle">Your carbon footprint at a glance</p>
              </div>
            </div>

            {/* STREAK */}
            <div className="streak-card">
              <div className="streak-left">
                <span className="streak-fire">🔥</span>
                <div className="streak-count">{streak.current}</div>
                <div className="streak-label">Low Carbon Streak</div>
              </div>
              <div className="streak-divider" />
              <div className="streak-right">
                <div className="streak-best">
                  🏆 Best &nbsp;<b>{streak.best}</b><span>days</span>
                </div>
                <div className="streak-rule">≤ 4 kg CO₂ / day</div>
              </div>
            </div>

            {streak.current === 0 && (
              <div className="streak-warning">
                ⚠️ Streak paused — today was above 4 kg
              </div>
            )}

            {/* PREDICTION RESULT */}
            {prediction && (
  <div className="prediction-result">

    {/* Header */}
    <div className="prediction-header">
      <div>
        <h3>🔮 Tomorrow's CO₂ Prediction</h3>
        <p>Based on your last {prediction.past_logs_used} logged days</p>
      </div>
      <button className="pred-close" onClick={() => setPrediction(null)}>✕</button>
    </div>

    {/* Summary row */}
    <div className="prediction-totals">
      <div className="pred-total-card">
        <span className="pred-total-label">Past Avg / day</span>
        <span className="pred-total-value">
          {prediction.past_avg_co2} <small>kg</small>
        </span>
      </div>
      <div className="pred-total-card">
        <span className="pred-total-label">Predicted Tomorrow</span>
        <span className="pred-total-value" style={{
          color: prediction.predicted_tomorrow <= 4
            ? "#39ff7e"
            : prediction.predicted_tomorrow <= 7
            ? "#fbbf24"
            : "#f87171"
        }}>
          {prediction.predicted_tomorrow} <small>kg</small>
        </span>
      </div>
      <div className="pred-total-card">
        <span className="pred-total-label">Daily Target</span>
        <span className="pred-total-value">4 <small>kg</small></span>
      </div>
      <div className="pred-total-card">
        <span className="pred-total-label">Status</span>
        <span className="pred-total-value" style={{ fontSize: "14px", marginTop: "4px" }}>
          {prediction.predicted_tomorrow <= 4
            ? "✅ On Target"
            : prediction.predicted_tomorrow <= 7
            ? "⚠️ Above Target"
            : "🔴 High"}
        </span>
      </div>
    </div>

    {/* Past 7 days bar chart */}
    <div className="pred-col" style={{ marginBottom: "16px" }}>
      <div className="pred-col-title">📅 Past {prediction.past_7_days.length} Days (Actual)</div>
      {prediction.past_7_days.map((co2, i) => {
        const pct   = Math.min((co2 / 12) * 100, 100);
        const color = co2 <= 4 ? "#39ff7e" : co2 <= 7 ? "#fbbf24" : "#f87171";
        return (
          <div key={i} className="pred-bar-row">
            <span className="pred-bar-label">Day -{prediction.past_7_days.length - i}</span>
            <div className="pred-bar-track">
              <div className="pred-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="pred-bar-value">{co2} kg</span>
          </div>
        );
      })}

      {/* Tomorrow's predicted bar */}
      <div className="pred-bar-row" style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
        <span className="pred-bar-label" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Tomorrow
        </span>
        <div className="pred-bar-track">
          <div
            className="pred-bar-fill"
            style={{
              width: `${Math.min((prediction.predicted_tomorrow / 12) * 100, 100)}%`,
              background: prediction.predicted_tomorrow <= 4
                ? "#39ff7e"
                : prediction.predicted_tomorrow <= 7
                ? "#fbbf24"
                : "#f87171",
              opacity: 0.7,
            }}
          />
        </div>
        <span className="pred-bar-value" style={{ fontWeight: 700 }}>
          {prediction.predicted_tomorrow} kg
        </span>
      </div>
    </div>

    {/* Avg features used */}
    <div className="pred-features-used">
      <div className="pred-features-title">📊 Based on your average daily habits</div>
      <div className="pred-features-grid">
        <div className="pred-feat"><span>🚗</span>{prediction.avg_features.travel_km} km</div>
        <div className="pred-feat"><span>⚡</span>{prediction.avg_features.electricity_kwh} kWh</div>
        <div className="pred-feat"><span>❄️</span>{prediction.avg_features.ac_hours} hrs AC</div>
        <div className="pred-feat"><span>🌀</span>{prediction.avg_features.fan_hours} hrs fan</div>
      </div>
    </div>

    {/* Suggestions */}
    <div className="suggestion-list">
      {prediction.suggestions.map((s, i) => (
        <div key={i} className="suggestion-item">
          <span className="sug-icon">{s.icon}</span>
          <div><b>{s.title}</b><p>{s.detail}</p></div>
        </div>
      ))}
    </div>

  </div>
)}
           
            {/* METRICS */}
            <div className="metrics-grid">
              <Metric title="Total CO₂"   value={stats.total_co2} color="purple" icon="🌐" unit="kg" />
              <Metric title="Avg Daily"   value={stats.avg_daily}  color="blue"   icon="📈" unit="kg" />
              <Metric title="Lowest Day"  value={stats.min_daily}  color="green"  icon="🌱" unit="kg" />
              <Metric title="Highest Day" value={stats.max_daily}  color="red"    icon="🔺" unit="kg" />
            </div>

            {/* INSIGHT */}
            <div className="dash-bottom">
              <div className="dash-input">
                <div className="insight-icon">🌍</div>
                <h3>Carbon Insight</h3>
                <p>Keep your daily footprint below <b>4 kg CO₂</b> to maintain your streak and help the planet 🌱</p>
              </div>
            </div>
          </>
        )}

        {/* ════ LOGS ════ */}
        {activePage === "logs" && (
          <div className="dashboard-split">
            <div className="dashboard-main-area">
              <h2 className="section-title">📊 Weekly Overview</h2>
              <Co2Chart />
            </div>
            <div className="dashboard-logs-sidebar">
              <div className="logs-header">
                <h3>📅 Daily Logs</h3>
                <button className="add-log-btn" onClick={() => setShowDailyLog(true)}>➕</button>
              </div>
              <div className="logs-container">
                <LogsList />
              </div>
            </div>
          </div>
        )}

        {/* ════ CALENDAR ════ */}
        {activePage === "heatmap" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="welcome-title">📅 Carbon Calendar</h1>
                <p className="welcome-subtitle">Your full year of CO₂ — every day at a glance</p>
              </div>
            </div>
            <div className="heatmap-page-card">
              <HeatmapCalendar />
            </div>
          </>
        )}

      </main>

      {/* DAILY LOG MODAL */}
      {showDailyLog && (
        <DailyLog onClose={() => setShowDailyLog(false)} />
      )}

    </div>
  );
}

const Metric = ({ title, value, color, icon, unit }) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-icon">{icon}</div>
    <h4>{title}</h4>
    <h2>{value?.toFixed(2)} <span>{unit}</span></h2>
  </div>
);

export default Dashboard;