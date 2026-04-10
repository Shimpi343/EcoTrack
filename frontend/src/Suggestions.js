import React, { useEffect, useState } from "react";
import api from "./api";

function Suggestions() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/suggestions");
        setTips(res.data.suggestions);
      } catch (e) {
        console.error("Failed to load suggestions", e);
      }
    };
    load();
  }, []);

  return (
    <div style={{
      padding: "20px",
      background: "#e8f5e9",
      borderRadius: "12px",
      marginTop: "20px",
      borderLeft: "6px solid #1e3c72"
    }}>
      <h2>🌱 AI Suggestions for You</h2>

      {tips.map((t, i) => (
        <p key={i} style={{ fontSize: "18px", margin: "10px 0" }}>
          • {t}
        </p>
      ))}
    </div>
  );
}

export default Suggestions;