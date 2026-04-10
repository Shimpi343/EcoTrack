import React, { useEffect, useState } from "react";
import "./HeatmapCalendar.css";
import api from "./api";
 
// ── colour based on CO2 value ──────────────────────────────
function getColor(co2) {
  if (co2 === null || co2 === undefined) return "empty";
  const v = parseFloat(co2);
  if (v === 0)   return "zero";
  if (v <= 2)    return "level1";   // excellent
  if (v <= 4)    return "level2";   // good
  if (v <= 6)    return "level3";   // moderate
  if (v <= 9)    return "level4";   // high
  return              "level5";     // very high
}
 
// ── build a full-year grid ─────────────────────────────────
function buildYearGrid(logs) {
  // map date-string → co2
  const map = {};
  logs.forEach((l) => {
    if (l.log_date) {
      const key = l.log_date.slice(0, 10);   // "YYYY-MM-DD"
      map[key] = parseFloat(l.computed_co2 || 0);
    }
  });
 
  const today  = new Date();
  const result = [];   // array of weeks; each week = array of 7 day objects
 
  // start from 52 weeks ago, aligned to Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  // rewind to previous Sunday
  start.setDate(start.getDate() - start.getDay());
 
  let cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const isFuture = cursor > today;
      week.push({
        date:  dateStr,
        co2:   isFuture ? null : (map[dateStr] ?? null),
        today: dateStr === today.toISOString().slice(0, 10),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    result.push(week);
  }
  return result;
}
 
// ── month labels ───────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];
 
function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = new Date(week[0].date).getMonth();
    if (m !== lastMonth) {
      labels.push({ col: i, label: MONTHS[m] });
      lastMonth = m;
    }
  });
  return labels;
}
 
// ── COMPONENT ──────────────────────────────────────────────
function HeatmapCalendar() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null); // {x,y,date,co2}
  const [stats,   setStats]   = useState(null);
 
  useEffect(() => {
    api.get("/api/logs")
      .then((res) => {
        const data = res.data || [];
        setLogs(data);
 
        // compute quick stats
        const logged = data.filter((l) => l.computed_co2 > 0);
        const goodDays = logged.filter((l) => parseFloat(l.computed_co2) <= 4).length;
        const total    = logged.reduce((s, l) => s + parseFloat(l.computed_co2 || 0), 0);
        setStats({
          totalDays: logged.length,
          goodDays,
          totalCo2: total.toFixed(1),
          avgCo2:   logged.length ? (total / logged.length).toFixed(2) : "0.00",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
 
  if (loading) {
    return (
      <div className="heatmap-loading">
        <div className="heatmap-spinner" />
        <span>Loading calendar...</span>
      </div>
    );
  }
 
  const weeks       = buildYearGrid(logs);
  const monthLabels = getMonthLabels(weeks);
  const DAYS        = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
 
  return (
    <div className="heatmap-wrapper">
 
      {/* ── STATS ROW ── */}
      {stats && (
        <div className="heatmap-stats">
          <div className="hm-stat">
            <span className="hm-stat-value">{stats.totalDays}</span>
            <span className="hm-stat-label">Days logged</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-value good">{stats.goodDays}</span>
            <span className="hm-stat-label">Green days (≤ 4 kg)</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-value">{stats.totalCo2} kg</span>
            <span className="hm-stat-label">Total CO₂ logged</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-value">{stats.avgCo2} kg</span>
            <span className="hm-stat-label">Daily average</span>
          </div>
        </div>
      )}
 
      {/* ── GRID ── */}
      <div className="heatmap-scroll">
        <div className="heatmap-inner">
 
          {/* month labels row */}
          <div className="heatmap-months">
            <div className="heatmap-day-col" />
            {weeks.map((_, i) => {
              const lbl = monthLabels.find((m) => m.col === i);
              return (
                <div key={i} className="heatmap-month-cell">
                  {lbl ? lbl.label : ""}
                </div>
              );
            })}
          </div>
 
          {/* day rows */}
          {DAYS.map((dayName, dayIdx) => (
            <div key={dayIdx} className="heatmap-row">
              <div className="heatmap-day-label">
                {/* only show Mon, Wed, Fri */}
                {[1, 3, 5].includes(dayIdx) ? dayName : ""}
              </div>
              {weeks.map((week, wIdx) => {
                const cell = week[dayIdx];
                const color = cell.co2 !== null
                  ? getColor(cell.co2)
                  : "empty";
                return (
                  <div
                    key={wIdx}
                    className={`heatmap-cell ${color} ${cell.today ? "today" : ""}`}
                    onMouseEnter={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      setTooltip({
                        x:    rect.left + rect.width / 2,
                        y:    rect.top - 8,
                        date: cell.date,
                        co2:  cell.co2,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
 
        </div>
      </div>
 
      {/* ── LEGEND ── */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        <div className="heatmap-cell empty"  />
        <div className="heatmap-cell level1" />
        <div className="heatmap-cell level2" />
        <div className="heatmap-cell level3" />
        <div className="heatmap-cell level4" />
        <div className="heatmap-cell level5" />
        <span className="heatmap-legend-label">More CO₂</span>
 
        <div className="heatmap-legend-key">
          <div className="heatmap-cell level1" />
          <span>≤ 2 kg</span>
          <div className="heatmap-cell level2" />
          <span>≤ 4 kg</span>
          <div className="heatmap-cell level3" />
          <span>≤ 6 kg</span>
          <div className="heatmap-cell level4" />
          <span>≤ 9 kg</span>
          <div className="heatmap-cell level5" />
          <span>&gt; 9 kg</span>
        </div>
      </div>
 
      {/* ── TOOLTIP (portal-style via fixed) ── */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="heatmap-tooltip-date">
            {new Date(tooltip.date + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "short",
              day:     "numeric",
              month:   "short",
              year:    "numeric",
            })}
          </div>
          <div className="heatmap-tooltip-val">
            {tooltip.co2 !== null
              ? `${parseFloat(tooltip.co2).toFixed(2)} kg CO₂`
              : "No data logged"}
          </div>
        </div>
      )}
 
    </div>
  );
}
 
export default HeatmapCalendar;