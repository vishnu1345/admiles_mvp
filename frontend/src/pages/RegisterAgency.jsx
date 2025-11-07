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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/register/business", form);
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
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <input
            placeholder="Contact Person"
            value={form.contactPerson}
            onChange={(e) =>
              setForm({ ...form, contactPerson: e.target.value })
            }
          />
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Business Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            placeholder="GST Number (Optional)"
            value={form.gst}
            onChange={(e) => setForm({ ...form, gst: e.target.value })}
          />
          <button type="submit">Register Agency</button>
        </form>
      </div>
    </div>
  );
}
