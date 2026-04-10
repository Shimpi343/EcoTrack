import React, { useState } from "react";
import Login from "./Login";
import Signup from "./signup";
import "./authpage.css";

function AuthContainer({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="container">

      {/* FORMS ROW */}
      <div className="row">

        {/* LOGIN */}
        <div className="col">
          <div className="form-wrapper">
            <Login
              onLoginSuccess={onLoginSuccess}
              goToSignup={() => setMode("signup")}
            />
          </div>
        </div>

        {/* SIGNUP */}
        <div className="col">
          <div className="form-wrapper">
            <Signup
              onSignupSuccess={() => setMode("login")}
              goToLogin={() => setMode("login")}
            />
          </div>
        </div>

      </div>

      {/* TEXT OVERLAY */}
      <div className="row content-row">
        <div className="col align-items-center">
          <div className="text">
            <h2>Welcome Back</h2>
            <p>Track your carbon footprint ✨</p>
          </div>
        </div>

        <div className="col align-items-center">
          <div className="text">
            <h2>Join EcoTrack</h2>
            <p>Start your eco-friendly journey 🌿</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AuthContainer;