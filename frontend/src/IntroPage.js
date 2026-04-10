import React from "react";
import "./intro.css";

function IntroPage({ onStart }) {
  return (
   <div className="landing-wrapper">

  {/* NAVBAR */}
  <nav className="navbar">
    <div className="nav-logo">EcoTrack</div>

    <div className="nav-links">
      <a href="#hero">Home</a>
      <a href="#about">About</a>
      <a href="#features">Features</a>
      <button className="nav-btn" onClick={onStart}>Login</button>
    </div>
  </nav>


      {/* HERO SECTION */}
      <section className="hero-section fade-in">
        <div className="hero-left slide-up">
          <h1 className="hero-title">Measure Today.</h1>
          <h1 className="hero-title highlight">Improve Tomorrow.</h1>

          <p className="hero-desc">
            EcoTrack helps you understand your carbon footprint through
            smart tracking, real-time analytics, and personalized insights.
            Build habits that save the planet 🌍
          </p>

          <button className="hero-btn" onClick={onStart}>
            Start Journey →
          </button>
        </div>

        <div className="hero-right slide-up-delayed">
          <img
            src="https://media.giphy.com/media/FrOlhISiIhAFa/giphy-downsized-large.gif"
            alt="Earth"
            className="hero-earth"
          />
        </div>
      </section>

      {/* SCROLL DOWN ARROW */}
      <div className="scroll-down">▼</div>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section fade-in-slow">
        <h2>What is EcoTrack?</h2>
        <p>
          EcoTrack is your personal sustainability assistant. Log your
          daily activities, get instant CO₂ calculations and see meaningful
          insights that help you reduce your environmental impact.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section fade-in-slower">
        <h2>Why Choose EcoTrack?</h2>

        <div className="features-grid">
          <div className="feature-card hover-up">
            <h3>📊 Smart Analytics</h3>
            <p>Understand your exact carbon footprint with clear daily, weekly and monthly reports.</p>
          </div>

          <div className="feature-card hover-up">
            <h3>🌱 Personalized Insights</h3>
            <p>AI-generated suggestions help you build sustainable habits over time.</p>
          </div>

          <div className="feature-card hover-up">
            <h3>🕒 Real-time Tracking</h3>
            <p>Input your activity and get instant CO₂ analysis, anytime and anywhere.</p>
          </div>

          <div className="feature-card hover-up">
            <h3>📱 Fully Responsive</h3>
            <p>EcoTrack works beautifully on mobile, tablet and desktop.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer fade-in-slowest">
        © 2025 EcoTrack — Designed for a sustainable future 🌿
      </footer>

    </div>
  );
}

export default IntroPage;
