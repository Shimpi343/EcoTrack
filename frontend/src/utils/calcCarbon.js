export function calculateCarbon(form = {}) {
  // ✅ SAFE DEFAULTS
  const appliances = form.appliances || {};
  const cooking = form.cooking || [];
  const travelMode = form.travelMode || "walk";
  const vehicleType = form.vehicleType || "average";
  const tripType = form.tripType || "short";
  const diet = form.diet || "veg";

  let travel_co2 = 0;
  let travel_km = 0;

  /* -------- TRAVEL -------- */
  if (travelMode !== "walk" && travelMode !== "cycle") {
    travel_km =
      tripType === "short" ? 5 :
      tripType === "medium" ? 15 :
      30;

    const vehicleFactor = {
      petrol: 0.192,
      diesel: 0.171,
      ev: 0.05,
      average: 0.14
    };

    travel_co2 = travel_km * (vehicleFactor[vehicleType] || 0.14);
  }

  /* -------- ELECTRICITY -------- */
  let electricity_kwh = 0;

  Object.keys(appliances).forEach((key) => {
    electricity_kwh += Number(appliances[key] || 0);
  });

  const electricity_co2 = electricity_kwh * 0.82; // India avg

  /* -------- COOKING -------- */
  const lpg_kg = cooking.length * 0.3;
  const cooking_co2 = lpg_kg * 2.98;

  /* -------- DIET -------- */
  const diet_co2 = {
    veg: 1.5,
    vegan: 1.2,
    "non-veg": 3.5
  }[diet] || 2;

  /* -------- TOTAL -------- */
  const computed_co2 =
    travel_co2 +
    electricity_co2 +
    cooking_co2 +
    diet_co2;

  return {
    travel_km,
    electricity_kwh,
    lpg_kg,
    travel_co2,
    electricity_co2,
    cooking_co2,
    diet_co2,
    computed_co2
  };
}