import { useRef } from "react";

export function useVoiceInput(setForm) {
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("🎙️ Voice:", text);

      setForm((prev) => {
        let updated = JSON.parse(JSON.stringify(prev)); // deep copy

        /* ---------------- AGE ---------------- */
        const ageMatch = text.match(/(\d+)\s*(years|year|yrs)/);
        if (ageMatch) updated.age = Number(ageMatch[1]);

        /* ---------------- GENDER ---------------- */
        if (text.includes("male")) updated.gender = "male";
        if (text.includes("female")) updated.gender = "female";

        /* ---------------- DIET ---------------- */
        if (text.includes("vegetarian")) updated.diet = "veg";
        if (text.includes("non veg")) updated.diet = "non-veg";
        if (text.includes("vegan")) updated.diet = "vegan";

        /* ---------------- TRAVEL MODE ---------------- */
        if (text.includes("walk")) updated.travelMode = "walk";
        if (text.includes("cycle")) updated.travelMode = "cycle";
        if (text.includes("bike")) updated.travelMode = "bike";
        if (text.includes("car")) updated.travelMode = "car";
        if (text.includes("bus") || text.includes("public"))
          updated.travelMode = "public";

        /* ---------------- VEHICLE TYPE ---------------- */
        if (text.includes("petrol")) updated.vehicleType = "petrol";
        if (text.includes("diesel")) updated.vehicleType = "diesel";
        if (text.includes("electric")) updated.vehicleType = "ev";

        /* ---------------- DISTANCE ---------------- */
        const kmMatch = text.match(/(\d+)\s*(km|kilometer|kilometers)/);
        if (kmMatch) {
          updated.tripType =
            kmMatch[1] < 5 ? "short" : kmMatch[1] < 15 ? "medium" : "long";
        }

        /* ---------------- ELECTRICITY ---------------- */
        const hourMatch = text.match(/(\d+)\s*(hour|hours)/);

        if (text.includes("ac") && hourMatch)
          updated.appliances.ac = Number(hourMatch[1]);

        if (text.includes("tv") && hourMatch)
          updated.appliances.tv = Number(hourMatch[1]);

        if (text.includes("laptop") && hourMatch)
          updated.appliances.laptop = Number(hourMatch[1]);

        if (text.includes("fan") && hourMatch)
          updated.appliances.fan = Number(hourMatch[1]);

        /* ---------------- COOKING ---------------- */
        if (text.includes("stove") && !updated.cooking.includes("Stove"))
          updated.cooking.push("Stove");

        if (text.includes("microwave") && !updated.cooking.includes("Microwave"))
          updated.cooking.push("Microwave");

        if (text.includes("oven") && !updated.cooking.includes("Oven"))
          updated.cooking.push("Oven");

        return updated;
      });
    };

    recognition.onerror = (err) => {
      console.error("🎙️ Voice error:", err);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return { startListening };
}