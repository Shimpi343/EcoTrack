import React, { useState } from "react";
import api from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .add-log-form {
    background: #13161b;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
    padding: 36px 34px 30px;
    width: 100%;
    max-width: 500px;
    box-shadow:
      0 0 0 1px rgba(57,255,126,0.04),
      0 24px 60px rgba(0,0,0,0.55),
      0 0 80px rgba(57,255,126,0.05);
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: alFormIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
    position: relative;
    font-family: 'DM Sans', sans-serif;
  }

  .add-log-form::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #39ff7e, transparent);
    border-radius: 1px;
    opacity: 0.5;
  }

  @keyframes alFormIn {
    from { opacity: 0; transform: translateY(22px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .al-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }

  .al-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #0d2e1a, #1a4d2e);
    border: 1px solid rgba(57,255,126,0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 0 18px rgba(57,255,126,0.12);
  }

  .al-header h2 {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #eef1f6;
    letter-spacing: -0.4px;
    margin: 0 0 4px;
  }

  .al-header p {
    font-size: 13px;
    color: #4e5668;
    margin: 0;
  }

  .al-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 16px;
    margin-bottom: 22px;
  }

  .al-grid .al-field:first-child {
    grid-column: 1 / -1;
  }

  .al-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .al-field label {
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #4e5668;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .al-optional {
    font-size: 10px;
    font-weight: 400;
    color: #4e5668;
    text-transform: none;
    letter-spacing: 0;
    opacity: 0.7;
  }

  .al-field input,
  .al-field select {
    padding: 11px 14px;
    background: #1e222c;
    border: 1.5px solid rgba(255,255,255,0.07);
    border-radius: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #eef1f6;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }

  .al-field input::placeholder {
    color: #4e5668;
  }

  .al-field input:focus,
  .al-field select:focus {
    border-color: rgba(57,255,126,0.55);
    background: #1c2130;
    box-shadow: 0 0 0 3px rgba(57,255,126,0.10), 0 0 14px rgba(57,255,126,0.07);
  }

  .al-field input[type="date"] {
    color-scheme: dark;
    cursor: pointer;
  }

  .al-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234e5668' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 13px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .al-field select option {
    background: #1a1e26;
    color: #eef1f6;
  }

  .al-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .al-input-wrap input {
    padding-right: 64px;
  }

  .al-unit {
    position: absolute;
    right: 11px;
    font-size: 10.5px;
    font-weight: 700;
    color: #26c45f;
    background: rgba(57,255,126,0.08);
    border: 1px solid rgba(57,255,126,0.15);
    padding: 3px 8px;
    border-radius: 6px;
    pointer-events: none;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .al-submit {
    width: 100%;
    padding: 14px;
    background: #39ff7e;
    color: #060f09;
    border: none;
    border-radius: 13px;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
    box-shadow: 0 0 22px rgba(57,255,126,0.35), 0 6px 20px rgba(57,255,126,0.20);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .al-submit:hover {
    background: #4dff90;
    transform: translateY(-2px);
    box-shadow: 0 0 36px rgba(57,255,126,0.55), 0 10px 28px rgba(57,255,126,0.30);
  }

  .al-submit:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    .add-log-form {
      padding: 26px 20px 22px;
      border-radius: 20px;
    }
    .al-grid {
      grid-template-columns: 1fr;
    }
    .al-grid .al-field:first-child {
      grid-column: auto;
    }
  }
`;

function AddLog({ onSuccess }) {
  const [form, setForm] = useState({
    log_date: "",
    travel_km: "",
    electricity_kwh: "",
    lpg_kg: "",
    diet_type: "vegetarian",
    other_emissions: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        log_date: form.log_date,
        travel_km: Number(form.travel_km) || 0,
        electricity_kwh: Number(form.electricity_kwh) || 0,
        lpg_kg: Number(form.lpg_kg) || 0,
        diet_type: form.diet_type,
        other_emissions: Number(form.other_emissions) || 0,

        // 🔹 CO₂ will be calculated later
        computed_co2: 0,

        // 🔹 Store full raw input for future ML use
        raw_json: JSON.stringify(form),
      };

      const res = await api.post("/api/logs", payload);

      alert("✅ Log added successfully!");

      if (onSuccess) onSuccess();

      // Reset form
      setForm({
        log_date: "",
        travel_km: "",
        electricity_kwh: "",
        lpg_kg: "",
        diet_type: "vegetarian",
        other_emissions: "",
      });

    } catch (err) {
      console.error("ERROR ADDING LOG:", err.response?.data || err);
      alert("❌ Error adding log. Please login again.");
    }
  };

  return (
    <>
      <style>{styles}</style>

      <form onSubmit={handleSubmit} className="add-log-form">

        <div className="al-header">
          <div className="al-icon">🌱</div>
          <div>
            <h2>Add Daily Log</h2>
            <p>Track today's carbon footprint</p>
          </div>
        </div>

        <div className="al-grid">

          <div className="al-field">
            <label htmlFor="log_date">📅 Date</label>
            <input
              id="log_date"
              type="date"
              name="log_date"
              value={form.log_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="al-field">
            <label htmlFor="travel_km">🚗 Travel Distance</label>
            <div className="al-input-wrap">
              <input
                id="travel_km"
                type="number"
                name="travel_km"
                placeholder="0"
                value={form.travel_km}
                onChange={handleChange}
              />
              <span className="al-unit">km</span>
            </div>
          </div>

          <div className="al-field">
            <label htmlFor="electricity_kwh">⚡ Electricity Used</label>
            <div className="al-input-wrap">
              <input
                id="electricity_kwh"
                type="number"
                name="electricity_kwh"
                placeholder="0"
                value={form.electricity_kwh}
                onChange={handleChange}
              />
              <span className="al-unit">kWh</span>
            </div>
          </div>

          <div className="al-field">
            <label htmlFor="lpg_kg">🔥 LPG Used</label>
            <div className="al-input-wrap">
              <input
                id="lpg_kg"
                type="number"
                name="lpg_kg"
                placeholder="0"
                value={form.lpg_kg}
                onChange={handleChange}
              />
              <span className="al-unit">kg</span>
            </div>
          </div>

          <div className="al-field">
            <label htmlFor="diet_type">🥗 Diet Type</label>
            <select
              id="diet_type"
              name="diet_type"
              value={form.diet_type}
              onChange={handleChange}
            >
              <option value="vegetarian">🥦 Vegetarian</option>
              <option value="vegan">🌱 Vegan</option>
              <option value="omnivore">🍖 Omnivore</option>
              <option value="pescatarian">🐟 Pescatarian</option>
            </select>
          </div>

          <div className="al-field">
            <label htmlFor="other_emissions">
              💨 Other Emissions <span className="al-optional">(optional)</span>
            </label>
            <div className="al-input-wrap">
              <input
                id="other_emissions"
                type="number"
                name="other_emissions"
                placeholder="0"
                value={form.other_emissions}
                onChange={handleChange}
              />
              <span className="al-unit">kg CO₂</span>
            </div>
          </div>

        </div>

        <button type="submit" className="al-submit">Save Daily Log 🌱</button>

      </form>
    </>
  );
}

export default AddLog;
