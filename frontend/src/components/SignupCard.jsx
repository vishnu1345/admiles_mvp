import React from "react";
import "./SignupCard.css";

function SignupCard({ title, description, buttonText, features }) {
  return (
    <div className="cardbox">
      <h2 className="cardbox-title">{title}</h2>
      <p className="cardbox-desc">{description}</p>
      <button className="btn">{buttonText}</button>
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index}>✓ {feature}</li>
        ))}
      </ul>
    </div>
  );
}

export default SignupCard;
