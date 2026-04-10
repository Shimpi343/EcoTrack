import React from "react";

function CarbonPreview({ carbon, next, back }) {
  if (!carbon) return null;

  return (
    <>
      <div className="card-title">Today’s Impact 🌍</div>
      <div className="card-sub">Swipe to see breakdown</div>

      <div className="swipe-row">
        <div className="impact-card">
          <h4>🚗 Travel</h4>
          <p>{carbon.travel_co2.toFixed(2)} kg CO₂</p>
          <small>Movement impact</small>
        </div>

        <div className="impact-card">
          <h4>💡 Electricity</h4>
          <p>{carbon.electricity_co2.toFixed(2)} kg CO₂</p>
          <small>Home energy</small>
        </div>

        <div className="impact-card">
          <h4>🍽 Food</h4>
          <p>{carbon.food_co2.toFixed(2)} kg CO₂</p>
          <small>Cooking & meals</small>
        </div>

        <div className="impact-card highlight">
          <h4>🌱 Total</h4>
          <p>{carbon.computed_co2.toFixed(2)} kg</p>
          <small>Your footprint today</small>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn secondary" onClick={back}>
          ← Edit
        </button>
        <button className="btn primary" onClick={next}>
          Save Log 🌱
        </button>
      </div>
    </>
  );
}

export default CarbonPreview;