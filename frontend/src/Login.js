import React, { useState } from "react";
import api from "./api";
import "./login.css";

function Login({ onLoginSuccess, goToSignup }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await api.post("/api/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("user_id", res.data.user.id);

      onLoginSuccess();
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-brand">
            <span className="login-brand-icon">🌿</span>
            <span className="login-brand-name">EcoTrack</span>
          </div>
          <h2 className="login-tagline">Track your footprint.<br />Shape your future.</h2>
          <p className="login-sub">Join thousands of users building a more sustainable daily life with smart carbon insights.</p>
          <div className="login-stats">
            <div className="login-stat"><b>12k+</b><span>Active users</span></div>
            <div className="login-stat-divider" />
            <div className="login-stat"><b>4.9★</b><span>Avg rating</span></div>
            <div className="login-stat-divider" />
            <div className="login-stat"><b>98%</b><span>Satisfaction</span></div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="form sign-in">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue your eco journey</p>
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button onClick={login}>Sign In →</button>

          <p className="form-footer">
            Don't have an account?
            <b className="pointer" onClick={goToSignup}> Sign Up</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
