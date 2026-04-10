import React from "react";

function ElectricityCard({ data, update, next, back }) {
  return (
    <>
      <div className="card-title">Electricity Usage</div>
      <div className="card-sub">
        Think about lights, fans, AC, TV etc.
      </div>

      <div className="choice-column">
        <div
          className={`big-choice ${data.electricity === "low" ? "active" : ""}`}
          onClick={() => update({ electricity: "low" })}
        >
          🌑 Low usage
          <small>Mostly lights & fans</small>
        </div>

        <div
          className={`big-choice ${
            data.electricity === "normal" ? "active" : ""
          }`}
          onClick={() => update({ electricity: "normal" })}
        >
          💡 Normal usage
          <small>TV, laptop, fans</small>
        </div>

        <div
          className={`big-choice ${
            data.electricity === "high" ? "active" : ""
          }`}
          onClick={() => update({ electricity: "high" })}
        >
          ⚡ Heavy usage
          <small>AC / Heater / Long usage</small>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn secondary" onClick={back}>
          ← Back
        </button>
        <button
          className="btn primary"
          onClick={next}
          disabled={!data.electricity}
        >
          Next →
        </button>
      </div>
    </>
  );
}

export default ElectricityCard;