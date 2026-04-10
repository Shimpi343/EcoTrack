import React from "react";

function FoodCard({ data, update, next, back }) {
  return (
    <>
      <div className="card-title">Food & Cooking</div>
      <div className="card-sub">
        Choose the option closest to your day
      </div>

      <div className="choice-column">
        <div
          className={`big-choice ${data.food === "home_simple" ? "active" : ""}`}
          onClick={() => update({ food: "home_simple" })}
        >
          🥗 Home-cooked (simple)
          <small>Boiled / light cooking</small>
        </div>

        <div
          className={`big-choice ${data.food === "home_heavy" ? "active" : ""}`}
          onClick={() => update({ food: "home_heavy" })}
        >
          🍲 Home-cooked (heavy)
          <small>Frying / long gas usage</small>
        </div>

        <div
          className={`big-choice ${data.food === "outside" ? "active" : ""}`}
          onClick={() => update({ food: "outside" })}
        >
          🍔 Outside food
          <small>Restaurant / delivery</small>
        </div>

        <div
          className={`big-choice ${data.food === "mixed" ? "active" : ""}`}
          onClick={() => update({ food: "mixed" })}
        >
          🍱 Mixed
          <small>Both home & outside</small>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn secondary" onClick={back}>
          ← Back
        </button>
        <button
          className="btn primary"
          onClick={next}
          disabled={!data.food}
        >
          Next →
        </button>
      </div>
    </>
  );
}

export default FoodCard;