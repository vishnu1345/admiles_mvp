import React, { useState } from "react";
import { api } from "../utils/api";
import "../pages/BusinessDashboard.css";

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
    requirements: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    try {
      await api.post("/api/campaigns", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Wait a moment for the request to complete before closing
      setTimeout(() => {
        onCreated(); // refresh campaigns
        onClose(); // close modal
      }, 200);
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert(err.response?.data?.message || "Error creating campaign");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevents close when clicking inside modal
      >
        <h3>+ Create New Campaign</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Campaign Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
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

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Target Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            name="duration"
            placeholder="Campaign Duration (days)"
            value={form.duration}
            onChange={handleChange}
          />

          <input
            name="earningPerKm"
            placeholder="Earning per KM"
            value={form.earningPerKm}
            onChange={handleChange}
          />

          <input
            name="totalBudget"
            placeholder="Total Budget"
            value={form.totalBudget}
            onChange={handleChange}
          />

          <input
            name="targetDrivers"
            placeholder="Target Drivers"
            value={form.targetDrivers}
            onChange={handleChange}
          />

          <textarea
            name="requirements"
            placeholder="Special Requirements"
            value={form.requirements}
            onChange={handleChange}
          />

          {/* Upload Section */}
          <div className="upload-section">
            <label>Upload Campaign Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Create Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
}
