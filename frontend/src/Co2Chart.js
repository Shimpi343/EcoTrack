import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "./api";
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
 
function Co2Chart() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api
      .get("/api/logs")
      .then((res) => {
        const data = res.data || [];
        // sort ascending by date, take last 7
        const sorted = [...data]
          .sort((a, b) => new Date(a.log_date) - new Date(b.log_date))
          .slice(-7);
        setLogs(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
 
  if (loading) {
    return (
      <div style={styles.center}>
        <p style={styles.muted}>Loading chart...</p>
      </div>
    );
  }
 
  if (!logs.length) {
    return (
      <div style={styles.center}>
        <span style={{ fontSize: 32 }}>📊</span>
        <p style={styles.muted}>No logs yet — add a daily log to see your chart</p>
      </div>
    );
  }
 
  const labels = logs.map((l) =>
    l.log_date
      ? new Date(l.log_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      : "—"
  );
 
  const values = logs.map((l) => parseFloat(l.computed_co2 || 0).toFixed(2));
 
  const barColors = values.map((v) => {
    const n = parseFloat(v);
    if (n <= 4)  return "rgba(57, 255, 126, 0.75)";   // green
    if (n <= 7)  return "rgba(251, 191, 36, 0.75)";   // amber
    return         "rgba(248, 113, 113, 0.75)";         // red
  });
 
  const borderColors = values.map((v) => {
    const n = parseFloat(v);
    if (n <= 4)  return "#39ff7e";
    if (n <= 7)  return "#fbbf24";
    return         "#f87171";
  });
 
  const chartData = {
    labels,
    datasets: [
      {
        label: "CO₂ (kg)",
        data: values,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#8b93a6",
          font: { size: 12, family: "'DM Sans', sans-serif" },
          boxWidth: 14,
        },
      },
      tooltip: {
        backgroundColor: "#13161b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#eef1f6",
        bodyColor: "#8b93a6",
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} kg CO₂`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#8b93a6",
          font: { size: 11, family: "'DM Sans', sans-serif" },
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
        border: {
          color: "rgba(255,255,255,0.08)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#8b93a6",
          font: { size: 11, family: "'DM Sans', sans-serif" },
          callback: (val) => `${val} kg`,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
        border: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };
 
  return (
    <div style={styles.wrapper}>
      {/* target line label */}
      <div style={styles.targetRow}>
        <span style={styles.targetDot} />
        <span style={styles.targetText}>4 kg daily target</span>
      </div>
 
      <div style={styles.chartBox}>
        <Bar data={chartData} options={options} />
 
        {/* target line overlay */}
        <div style={styles.targetLine} />
      </div>
 
      {/* legend */}
      <div style={styles.legend}>
        <span style={{ ...styles.dot, background: "#39ff7e" }} />
        <span style={styles.legendText}>≤ 4 kg (good)</span>
        <span style={{ ...styles.dot, background: "#fbbf24" }} />
        <span style={styles.legendText}>4–7 kg (moderate)</span>
        <span style={{ ...styles.dot, background: "#f87171" }} />
        <span style={styles.legendText}>&gt; 7 kg (high)</span>
      </div>
    </div>
  );
}
 
const styles = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  chartBox: {
    flex: 1,
    minHeight: "220px",
    position: "relative",
  },
  targetRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  targetDot: {
    width: "10px",
    height: "2px",
    background: "#4e5668",
    display: "inline-block",
    borderRadius: "2px",
  },
  targetText: {
    fontSize: "11px",
    color: "#4e5668",
    fontFamily: "'DM Sans', sans-serif",
  },
  targetLine: {
    position: "absolute",
    left: "0",
    right: "0",
    // approximate y for value=4 — visual guide only
    bottom: "30%",
    height: "1px",
    background: "rgba(78, 86, 104, 0.4)",
    borderTop: "1px dashed rgba(78,86,104,0.5)",
    pointerEvents: "none",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  legendText: {
    fontSize: "11px",
    color: "#8b93a6",
    marginRight: "8px",
    fontFamily: "'DM Sans', sans-serif",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    gap: "10px",
    textAlign: "center",
  },
  muted: {
    fontSize: "13px",
    color: "#4e5668",
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
  },
};
 
export default Co2Chart;