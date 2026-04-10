import React from "react";

function AboutCard({ data, update, next }) {
  return (
    <>
      <div className="card-title">Tell us about you</div>
      <div className="card-sub">
        This helps us estimate your daily impact
      </div>

      <label>Age: {data.age}</label>
      <input
        type="range"
        min="18"
        max="70"
        value={data.age}
        onChange={(e) => update({ age: Number(e.target.value) })}
      />

      <div className="choice-row">
        {["male", "female"].map((g) => (
          <div
            key={g}
            className={`choice ${data.gender === g ? "active" : ""}`}
            onClick={() => update({ gender: g })}
          >
            {g}
          </div>
        ))}
      </div>

      <div className="choice-row">
        {["veg", "non-veg", "vegan"].map((d) => (
          <div
            key={d}
            className={`choice ${data.diet === d ? "active" : ""}`}
            onClick={() => update({ diet: d })}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="card-actions">
        <button className="btn primary" onClick={next}>
          Next →
        </button>
      </div>
    </>
  );
}

export default AboutCard;