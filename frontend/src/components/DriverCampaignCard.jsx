import React from "react";
import "../App.css"

export default function DriverCampaignCard({ campaign, onApply }) {
  return (
    <div className="driver-card">
      <img
        src={campaign.imageUrl}
        alt={campaign.title}
        className="driver-card-image"
      />
      <div className="driver-card-content">
        <h3>{campaign.title}</h3>
        <div className="tag-row">
          <span className="category">{campaign.category}</span>
        </div>
        <p className="company">
          {campaign.agency?.businessProfile?.companyName}
        </p>
        <p className="desc">{campaign.description}</p>
        <div className="meta">
          <p>🕒 {campaign.duration} days</p>
          <p>📍 {campaign.location}</p>
          <p className="price">
            ₹{campaign.earningPerKm}/km • ₹{campaign.totalBudget} total
          </p>
        </div>
        <button className="apply-btn" onClick={() => onApply(campaign._id)}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
