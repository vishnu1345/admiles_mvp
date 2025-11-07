import React, { useState } from "react";
import { api } from "../utils/api";

export default function CreateCampaignModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    duration: "",
    earningPerKm: "",
    totalBudget: "",
    targetDrivers: "",
    specialRequirements: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/campaigns", form);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>+ Create New Campaign</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Campaign Title</label>
          <input
            name="title"
            placeholder="e.g., Summer Sale Campaign"
            onChange={handleChange}
          />

          <label>Category</label>
          <select name="category" onChange={handleChange}>
            <option value="">Select category</option>
            <option>Food & Beverage</option>
            <option>E-commerce</option>
            <option>Technology</option>
            <option>Fashion</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Finance</option>
            <option>Other</option>
          </select>

          <label>Campaign Description</label>
          <textarea
            name="description"
            placeholder="Describe your campaign"
            onChange={handleChange}
          />

          <label>Target Location</label>
          <input
            name="location"
            placeholder="e.g., Mumbai"
            onChange={handleChange}
          />

          <label>Campaign Duration</label>
          <input
            name="duration"
            placeholder="e.g., 30 days"
            onChange={handleChange}
          />

          <label>Earning per KM (₹)</label>
          <input
            name="earningPerKm"
            type="number"
            placeholder="8"
            onChange={handleChange}
          />

          <label>Total Budget (₹)</label>
          <input
            name="totalBudget"
            type="number"
            placeholder="50000"
            onChange={handleChange}
          />

          <label>Target Drivers</label>
          <input
            name="targetDrivers"
            type="number"
            placeholder="20"
            onChange={handleChange}
          />

          <label>Campaign Image (URL)</label>
          <input
            name="imageUrl"
            type="text"
            placeholder="Paste image URL (temp until upload added)"
            onChange={handleChange}
          />

          <label>Special Requirements</label>
          <textarea
            name="specialRequirements"
            placeholder="Any specific driver requirements"
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
