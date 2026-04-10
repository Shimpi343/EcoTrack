import React, { useState } from "react";
import api from "./api";

function Signup({ onSignupSuccess, goToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const signup = async () => {
    try {
      await api.post("/api/signup", form);
      alert("Signup successful! Now login.");
      onSignupSuccess();
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="form sign-up">
      <h2>Create Account</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <button onClick={signup}>Sign Up</button>

      <p>
        Already have an account?
        <b className="pointer" onClick={goToLogin}> Sign In</b>
      </p>
    </div>
  );
}

export default Signup;
