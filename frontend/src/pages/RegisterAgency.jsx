import React, { useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function RegisterAgency() {
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const validate = () => {
    const newErrors = {};

    if (!form.companyName.trim())
      newErrors.companyName = "Company name is required.";

    if (!form.contactPerson.trim())
      newErrors.contactPerson = "Contact person name is required.";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone number must be exactly 10 digits.";

    if (!form.address.trim())
      newErrors.address = "Business address is required.";

  
    if (form.gst.trim() && !/^[0-9A-Z]{15}$/.test(form.gst))
      newErrors.gst = "GST number must be 15 alphanumeric characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fix the highlighted errors before submitting.");
      return;
    }

    try {
      await api.post("/api/register/business", form);
      alert("Agency registration successful!");
      navigate("/business-dashboard");
    } catch (err) {
      console.error(err);
      alert("Error completing registration");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>🏢 Agency Registration</h2>
        <p>
          Register your advertising agency to create campaigns and reach
          customers.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Company Name <span className="required">*</span>
          </label>
          <input
            placeholder="Enter company name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={errors.companyName ? "error-input" : ""}
          />
          {errors.companyName && <p className="error">{errors.companyName}</p>}

          <label>
            Contact Person <span className="required">*</span>
          </label>
          <input
            placeholder="Full name of contact person"
            value={form.contactPerson}
            onChange={(e) =>
              setForm({ ...form, contactPerson: e.target.value })
            }
            className={errors.contactPerson ? "error-input" : ""}
          />
          {errors.contactPerson && (
            <p className="error">{errors.contactPerson}</p>
          )}

          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            placeholder="10-digit phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={errors.phone ? "error-input" : ""}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>
            Business Address <span className="required">*</span>
          </label>
          <textarea
            placeholder="Full business address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={errors.address ? "error-input" : ""}
          />
          {errors.address && <p className="error">{errors.address}</p>}

          <label>GST Number (Optional)</label>
          <input
            placeholder="Enter 15-digit GST (optional)"
            value={form.gst}
            onChange={(e) => setForm({ ...form, gst: e.target.value })}
            className={errors.gst ? "error-input" : ""}
          />
          {errors.gst && <p className="error">{errors.gst}</p>}

          <button type="submit">Register Agency</button>
        </form>
      </div>
    </div>
  );
}
