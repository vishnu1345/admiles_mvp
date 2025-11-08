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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Phone validation
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone number must be exactly 10 digits.";

    // Rickshaw number
    if (!form.rickshawNumber.trim())
      newErrors.rickshawNumber = "Rickshaw number plate is required.";

    // License number
    if (!form.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required.";
    else if (!/^[A-Za-z0-9-]{5,20}$/.test(form.licenseNumber))
      newErrors.licenseNumber = "Enter a valid license number.";

    // ID doc URL
    if (!form.idDocUrl.trim())
      newErrors.idDocUrl = "ID document URL is required.";
    else if (!/^(https?:\/\/[^\s/$.?#].[^\s]*)$/i.test(form.idDocUrl))
      newErrors.idDocUrl = "Enter a valid URL starting with http or https.";

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
      await api.post("/api/register/driver", form);
      alert("Registration successful!");
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
          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            placeholder="Enter 10-digit phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={errors.phone ? "error-input" : ""}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>
            Rickshaw Number Plate <span className="required">*</span>
          </label>
          <input
            placeholder="E.g. MH12AB1234"
            value={form.rickshawNumber}
            onChange={(e) =>
              setForm({ ...form, rickshawNumber: e.target.value })
            }
            className={errors.rickshawNumber ? "error-input" : ""}
          />
          {errors.rickshawNumber && (
            <p className="error">{errors.rickshawNumber}</p>
          )}

          <label>
            Driving License Number <span className="required">*</span>
          </label>
          <input
            placeholder="E.g. DL0420150012345"
            value={form.licenseNumber}
            onChange={(e) =>
              setForm({ ...form, licenseNumber: e.target.value })
            }
            className={errors.licenseNumber ? "error-input" : ""}
          />
          {errors.licenseNumber && (
            <p className="error">{errors.licenseNumber}</p>
          )}

          <label>
            Upload ID Document (URL) <span className="required">*</span>
          </label>
          <input
            placeholder="Paste Google Drive / Cloud link"
            value={form.idDocUrl}
            onChange={(e) => setForm({ ...form, idDocUrl: e.target.value })}
            className={errors.idDocUrl ? "error-input" : ""}
          />
          {errors.idDocUrl && <p className="error">{errors.idDocUrl}</p>}

          <button type="submit">Register as Driver</button>
        </form>
      </div>
    </div>
  );
}
