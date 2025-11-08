import React, { useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function RegisterDriver() {
  const [form, setForm] = useState({
    phone: "",
    licenseNumber: "",
    rickshawNumber: "",
    idDocUrl: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/register/driver", form);
      navigate("/driver-dashboard");
    } catch (err) {
      console.error(err);
      alert("Error completing registration");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>🚖 Driver Registration</h2>
        <p>Register as a rickshaw driver to start earning money through ads.</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            placeholder="Rickshaw Number Plate"
            value={form.rickshawNumber}
            onChange={(e) =>
              setForm({ ...form, rickshawNumber: e.target.value })
            }
            required
          />
          <input
            placeholder="Driving License Number"
            value={form.licenseNumber}
            onChange={(e) =>
              setForm({ ...form, licenseNumber: e.target.value })
            }
            required
          />
          <input
            placeholder="Upload ID (URL for now)"
            value={form.idDocUrl}
            onChange={(e) => setForm({ ...form, idDocUrl: e.target.value })}
            required
          />
          <button type="submit">Register as Driver</button>
        </form>
      </div>
    </div>
  );
}
