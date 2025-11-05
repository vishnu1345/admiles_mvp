import React from "react";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <h2 className="logo">🚖 AdMiles</h2>
        <p className="tagline">Connecting Drivers & Advertisers</p>
      </nav>

      <section className="hero">
        <h1>Earn While You Drive</h1>
        <p>
          AdMiles connects rickshaw drivers with advertising agencies, helping
          drivers earn extra income by displaying ads on their vehicles while
          agencies reach their target audience.
        </p>
      </section>

      <section className="features">
        <div className="feature">
          <div className="icon">💰</div>
          <h3>Earn Extra Income</h3>
          <p>
            Get paid for every kilometer you drive with ads on your rickshaw
          </p>
        </div>
        <div className="feature">
          <div className="icon">📍</div>
          <h3>Choose Your Routes</h3>
          <p>Select ads that match your regular driving routes and schedule</p>
        </div>
        <div className="feature">
          <div className="icon">🏢</div>
          <h3>Trusted Partners</h3>
          <p>Work with verified advertising agencies and brands</p>
        </div>
      </section>

      <section className="cards">
        <div className="white-card"></div>
        <div className="white-card"></div>
      </section>

      <footer>
        <p>© 2025 AdMiles. Connecting drivers and advertisers across India.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
