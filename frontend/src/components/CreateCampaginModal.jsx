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
    contactEmail: "",
    contactPhone: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Campaign title is required.";
    if (!form.category) newErrors.category = "Select a campaign category.";
    if (!form.description.trim())
      newErrors.description = "Description cannot be empty.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.duration || isNaN(form.duration) || form.duration <= 0)
      newErrors.duration = "Enter a valid campaign duration (in days).";
    if (!form.earningPerKm || isNaN(form.earningPerKm))
      newErrors.earningPerKm = "Enter a valid earning per KM value.";
    if (!form.totalBudget || isNaN(form.totalBudget))
      newErrors.totalBudget = "Enter a valid total budget.";
    if (!form.targetDrivers || isNaN(form.targetDrivers))
      newErrors.targetDrivers = "Enter a valid number of target drivers.";
    if (!form.contactEmail.trim())
      newErrors.contactEmail = "Email is required.";
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        form.contactEmail
      )
    )
      newErrors.contactEmail = "Enter a valid email address.";
    if (!form.contactPhone.trim())
      newErrors.contactPhone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.contactPhone))
      newErrors.contactPhone = "Phone number must be exactly 10 digits.";
    if (!form.image) newErrors.image = "Campaign image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill all required fields correctly before submitting.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    try {
      await api.post("/api/campaigns", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTimeout(() => {
        onCreated();
        onClose();
      }, 200);
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert(err.response?.data?.message || "Error creating campaign");
    } finally{
        setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>+ Create New Campaign</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Campaign Title <span className="required">*</span>
          </label>
          <input
            name="title"
            placeholder="Campaign Title"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "error-input" : ""}
          />
          {errors.title && <p className="error">{errors.title}</p>}

          <label>
            Category <span className="required">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? "error-input" : ""}
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
          {errors.category && <p className="error">{errors.category}</p>}

          <label>
            Description <span className="required">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "error-input" : ""}
          />
          {errors.description && <p className="error">{errors.description}</p>}

          <label>
            Target Location <span className="required">*</span>
          </label>
          <input
            name="location"
            placeholder="Target Location"
            value={form.location}
            onChange={handleChange}
            className={errors.location ? "error-input" : ""}
          />
          {errors.location && <p className="error">{errors.location}</p>}

          <label>
            Campaign Duration (days) <span className="required">*</span>
          </label>
          <input
            name="duration"
            placeholder="Duration in days"
            value={form.duration}
            onChange={handleChange}
            className={errors.duration ? "error-input" : ""}
          />
          {errors.duration && <p className="error">{errors.duration}</p>}

          <label>
            Earning per KM <span className="required">*</span>
          </label>
          <input
            name="earningPerKm"
            placeholder="Earning per KM"
            value={form.earningPerKm}
            onChange={handleChange}
            className={errors.earningPerKm ? "error-input" : ""}
          />
          {errors.earningPerKm && (
            <p className="error">{errors.earningPerKm}</p>
          )}

          <label>
            Total Budget <span className="required">*</span>
          </label>
          <input
            name="totalBudget"
            placeholder="Total Budget"
            value={form.totalBudget}
            onChange={handleChange}
            className={errors.totalBudget ? "error-input" : ""}
          />
          {errors.totalBudget && <p className="error">{errors.totalBudget}</p>}

          <label>
            Target Drivers <span className="required">*</span>
          </label>
          <input
            name="targetDrivers"
            placeholder="Target Drivers"
            value={form.targetDrivers}
            onChange={handleChange}
            className={errors.targetDrivers ? "error-input" : ""}
          />
          {errors.targetDrivers && (
            <p className="error">{errors.targetDrivers}</p>
          )}

          <label>
            Contact Email <span className="required">*</span>
          </label>
          <input
            name="contactEmail"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={handleChange}
            className={errors.contactEmail ? "error-input" : ""}
          />
          {errors.contactEmail && (
            <p className="error">{errors.contactEmail}</p>
          )}

          <label>
            Contact Phone <span className="required">*</span>
          </label>
          <input
            name="contactPhone"
            placeholder="Contact Phone Number"
            value={form.contactPhone}
            onChange={handleChange}
            className={errors.contactPhone ? "error-input" : ""}
          />
          {errors.contactPhone && (
            <p className="error">{errors.contactPhone}</p>
          )}

          <label>Special Requirements</label>
          <textarea
            name="requirements"
            placeholder="Special Requirements"
            value={form.requirements}
            onChange={handleChange}
          />

          <div className="upload-section">
            <label>
              Upload Campaign Image <span className="required">*</span>
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {errors.image && <p className="error">{errors.image}</p>}
          </div>

          <div className="actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
