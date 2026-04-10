import React from "react";

function TravelCard({ data, update, next, back }) {
  return (
    <>
      <div className="card-title">Your Travel Today</div>
      <div className="card-sub">
        Select what you mostly used today
      </div>

      {/* TRAVEL MODE */}
      <div className="choice-row">
        {[
          { key: "walk", label: "🚶 Walk" },
          { key: "cycle", label: "🚴 Cycle" },
          { key: "bike", label: "🏍 Bike" },
          { key: "car", label: "🚗 Car" },
          { key: "public", label: "🚌 Public" },
        ].map((m) => (
          <div
            key={m.key}
            className={`choice ${data.travelMode === m.key ? "active" : ""}`}
            onClick={() =>
              update({
                travelMode: m.key,
                vehicleType: "",
                tripType: "",
              })
            }
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* VEHICLE TYPE (ONLY IF BIKE / CAR) */}
      {(data.travelMode === "bike" || data.travelMode === "car") && (
        <>
          <div className="card-sub" style={{ marginTop: 15 }}>
            What type of vehicle?
          </div>

          <div className="choice-row">
            {["petrol", "diesel", "ev"].map((v) => (
              <div
                key={v}
                className={`choice ${
                  data.vehicleType === v ? "active" : ""
                }`}
                onClick={() => update({ vehicleType: v })}
              >
                {v.toUpperCase()}
              </div>
            ))}
          </div>
        </>
      )}

      {/* DISTANCE (NO KM INPUT) */}
      {data.travelMode && data.travelMode !== "walk" && (
        <>
          <div className="card-sub" style={{ marginTop: 15 }}>
            How long was your travel?
          </div>

          <div className="choice-row">
            {[
              { key: "short", label: "🏠 Nearby" },
              { key: "medium", label: "🏙 City" },
              { key: "long", label: "🛣 Long" },
            ].map((t) => (
              <div
                key={t.key}
                className={`choice ${
                  data.tripType === t.key ? "active" : ""
                }`}
                onClick={() => update({ tripType: t.key })}
              >
                {t.label}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ACTIONS */}
      <div className="card-actions">
        <button className="btn secondary" onClick={back}>
          ← Back
        </button>
        <button
          className="btn primary"
          onClick={next}
          disabled={!data.travelMode}
        >
          Next →
        </button>
      </div>
    </>
  );
}

export default TravelCard;