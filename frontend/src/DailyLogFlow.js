import React, { useState } from "react";
import "./DailyLogFlow.css";

import AboutCard from "./cards/AboutCard";
import TravelCard from "./cards/TravelCard";
import ElectricityCard from "./cards/ElectricityCard";
import FoodCard from "./cards/FoodCard";
import ResultCard from "./cards/ResultCard";

function DailyLogFlow() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    age: 25,
    gender: "",
    diet: "",

    travelMode: "",
    vehicleType: "",
    tripType: "",

    electricityLevel: "", // low | normal | high
    cooking: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const update = (data) =>
    setForm((prev) => ({ ...prev, ...data }));

  const cards = [
    <AboutCard data={form} update={update} next={next} />,
    <TravelCard data={form} update={update} next={next} back={back} />,
    <ElectricityCard data={form} update={update} next={next} back={back} />,
    <FoodCard data={form} update={update} next={next} back={back} />,
    <ResultCard data={form} back={back} />,
  ];

  return (
    <div className="dailylog-flow-wrapper">
      <div className="card-container">
        {cards[step]}
      </div>
    </div>
  );
}

export default DailyLogFlow;