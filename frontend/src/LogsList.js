import React, { useEffect, useState } from "react";
import "./LogsList.css";
import api from "./api";
 
function LogsList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api.get("/api/logs")
      .then((res) => {
        setLogs(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
 
  if (loading) {
    return <div className="logs-loading">Loading logs...</div>;
  }
 
  if (!logs.length) {
    return (
      <div className="logs-empty">
        <span className="logs-empty-icon">📭</span>
        <p>No logs yet. Add your first daily log!</p>
      </div>
    );
  }
 
  return (
    <div className="logs-container">
      {logs.map((log) => {
        const co2 = parseFloat(log.computed_co2 || 0).toFixed(2);
        const isGood = parseFloat(co2) <= 4;
        const isMid  = parseFloat(co2) > 4 && parseFloat(co2) <= 7;
 
        return (
          <div key={log.id} className="log-item">
            <div className="log-item-left">
              <div className="log-date">
                {log.log_date
                  ? new Date(log.log_date).toLocaleDateString("en-IN", {
                      day:   "2-digit",
                      month: "short",
                      year:  "numeric",
                    })
                  : "—"}
              </div>
              <div className="log-details">
                <span>🚗 {parseFloat(log.travel_km || 0).toFixed(1)} km</span>
                <span>⚡ {parseFloat(log.electricity_kwh || 0).toFixed(1)} kWh</span>
                <span>🥗 {log.diet_type || "—"}</span>
              </div>
            </div>
 
            <div className={`log-co2 ${isGood ? "good" : isMid ? "mid" : "bad"}`}>
              {co2} <span>kg</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
 
export default LogsList;
 