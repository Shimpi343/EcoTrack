import React, { useState, useEffect } from "react";
import "./DailyLog.css";
import api from "./api";
import { calculateCarbon } from "./utils/calcCarbon";
import { useVoiceInput } from "./hooks/useVoiceInput";
import { speak } from "./utils/voice";

function DailyLog({ onClose }) {
  const [form, setForm] = useState({
    age: 25,
    gender: "male",
    diet: "veg",
    travelMode: "walk",
    vehicleType: "average",
    tripType: "short",
    appliances: {
      fan: 0,
      light: 0,
      tv: 0,
      laptop: 0,
      ac: 0,
    },
    cooking: [],
  });

  const [previewCarbon, setPreviewCarbon] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // 🎙 Voice input (unchanged)
  const { startListening } = useVoiceInput(setForm);

  /* ---------- LIVE PREVIEW (UNCHANGED) ---------- */
  useEffect(() => {
    try {
      setPreviewCarbon(calculateCarbon(form));
    } catch {
      setPreviewCarbon(null);
    }
  }, [form]);

  const toggleCooking = (item) => {
    setForm((prev) => ({
      ...prev,
      cooking: prev.cooking.includes(item)
        ? prev.cooking.filter((c) => c !== item)
        : [...prev.cooking, item],
    }));
  };

  const updateStreak = (todayCO2) => {
    const today = new Date().toISOString().split("T")[0];

    const streakData = JSON.parse(
      localStorage.getItem("carbon_streak")
    ) || {
      current: 0,
      best: 0,
      lastDate: null,
    };

    if (todayCO2 < 4) {
      if (streakData.lastDate === today) return streakData;

      streakData.current += 1;
      streakData.best = Math.max(streakData.best, streakData.current);
    } else {
      streakData.current = 0;
    }

    streakData.lastDate = today;
    localStorage.setItem("carbon_streak", JSON.stringify(streakData));

    return streakData;
  };

  /* ---------- SAVE LOG (UNCHANGED) ---------- */
  const handleSubmit = async () => {
    if (!previewCarbon) return;

    const payload = {
      log_date: new Date().toISOString().split("T")[0],
      travel_km: previewCarbon.travel_km || 0,
      electricity_kwh: previewCarbon.electricity_kwh || 0,
      lpg_kg: form.cooking.length * 0.3,
      diet_type: form.diet,
      other_emissions: 0,
      computed_co2: previewCarbon.computed_co2 || 0,
      raw_json: JSON.stringify(form),
    };

    await api.post("/api/logs", payload);

    // 🎙 VOICE SUMMARY
    const co2 = previewCarbon.computed_co2.toFixed(1);

    if (co2 <= 4) {
      speak(`Great job! Today your carbon footprint was ${co2} kilograms. Your streak continues.`);
    } else {
      speak(`Today your carbon footprint was ${co2} kilograms. The streak paused, but tomorrow is a fresh start.`);
    }

    updateStreak(previewCarbon.computed_co2);
    alert("✅ Daily log saved 🌱");
    onClose(); // ✅ AUTO CLOSE AFTER SAVE
  };

  return (
    <div className="dailylog-overlay">
      <div className="dailylog-card">

        {/* HEADER */}
        <div className="dailylog-header">
          <h2>📝 Daily Log</h2>
          <div className="header-actions">
            <button className="voice-btn" onClick={startListening}>
              🎙
            </button>
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
          </div>
        </div>

        {/* STEP TABS */}
        <div className="step-tabs">
          {["You", "Travel", "Electricity", "Cooking"].map((s, i) => (
            <span
              key={i}
              className={`step-tab ${activeStep === i ? "active" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              {s}
            </span>
          ))}
        </div>

        {/* CONTENT */}
        <div className="step-body">

          {/* STEP 1 — About You */}
          {activeStep === 0 && (
            <div className="step-animate">
              <label>Age: {form.age}</label>
              <input
                type="range"
                min="18"
                max="70"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
              />

              <label>Gender</label>
              <div className="chip-row">
                {["male", "female"].map((g) => (
                  <span
                    key={g}
                    className={`chip ${form.gender === g ? "active" : ""}`}
                    onClick={() => setForm({ ...form, gender: g })}
                  >
                    {g === "male" ? "👨 Male" : "👩 Female"}
                  </span>
                ))}
              </div>

              <label>Diet</label>
              <div className="chip-row">
                {["veg", "non-veg", "vegan"].map((d) => (
                  <span
                    key={d}
                    className={`chip ${form.diet === d ? "active" : ""}`}
                    onClick={() => setForm({ ...form, diet: d })}
                  >
                    {d === "veg" ? "🥦 Veg" : d === "non-veg" ? "🍖 Non-veg" : "🌱 Vegan"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Travel */}
          {activeStep === 1 && (
            <div className="step-animate">
              <p className="section-title">How did you travel today?</p>

              <div className="chip-row">
                {[
                  { key: "walk", label: "🚶 Walk" },
                  { key: "cycle", label: "🚴 Cycle" },
                  { key: "bike", label: "🏍 Bike" },
                  { key: "car", label: "🚗 Car" },
                  { key: "public", label: "🚌 Public" },
                ].map((m) => (
                  <span
                    key={m.key}
                    className={`chip large ${form.travelMode === m.key ? "active" : ""}`}
                    onClick={() => setForm({ ...form, travelMode: m.key })}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {(form.travelMode === "car" || form.travelMode === "bike") && (
                <div className="fuel-section">
                  <p className="fuel-label">Fuel type (optional)</p>
                  <div className="fuel-options">
                    {[
                      { key: "petrol", label: "Petrol ⛽" },
                      { key: "diesel", label: "Diesel 🚛" },
                      { key: "ev", label: "EV ⚡" },
                      { key: "average", label: "Don't know 🤷" },
                    ].map((v) => (
                      <button
                        key={v.key}
                        className={`fuel-btn ${form.vehicleType === v.key ? "active" : ""}`}
                        onClick={() => setForm({ ...form, vehicleType: v.key })}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Electricity */}
          {activeStep === 2 && (
            <div className="step-animate slider-grid">
              {Object.entries(form.appliances).map(([a, value]) => (
                <div key={a} className="slider-mini">
                  <label>
                    {a.toUpperCase()} — <b>{value} hrs</b>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        appliances: {
                          ...form.appliances,
                          [a]: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 4 — Cooking */}
          {activeStep === 3 && (
            <div className="step-animate">
              <p className="section-title">What did you cook with?</p>
              <div className="chip-row">
                {[
                  { key: "Stove", label: "🔥 Stove" },
                  { key: "Microwave", label: "📡 Microwave" },
                  { key: "Oven", label: "🍞 Oven" },
                  { key: "Airfryer", label: "💨 Airfryer" },
                ].map((c) => (
                  <span
                    key={c.key}
                    className={`chip ${form.cooking.includes(c.key) ? "active" : ""}`}
                    onClick={() => toggleCooking(c.key)}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        {previewCarbon && (
          <div className="dailylog-footer">
            <span>
              🌍 {previewCarbon.computed_co2.toFixed(2)} kg CO₂
            </span>
            <button onClick={handleSubmit}>Save 🌱</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default DailyLog;
