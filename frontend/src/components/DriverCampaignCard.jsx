import React from "react";

export default function DriverCampaignCard({ campaign, onApply }) {
  return (
    <div className="campaign-card">
      <img
        src={campaign.imageUrl || "https://via.placeholder.com/300x200"}
        alt={campaign.title}
      />
      <div className="info">
        <h3>{campaign.title}</h3>
        <p className="category">{campaign.category}</p>
        <p>{campaign.agency?.name}</p>
        <p className="desc">{campaign.description}</p>

        <p>🕒 {campaign.duration}</p>
        <p>📍 {campaign.location}</p>
        <p className="price">
          ₹{campaign.earningPerKm}/km • ₹{campaign.totalBudget} total
        </p>

        <button className="apply-btn" onClick={() => onApply(campaign._id)}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
