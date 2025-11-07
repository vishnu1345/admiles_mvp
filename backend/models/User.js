import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["driver", "business"], required: true },
    completed: { type: Boolean, default: false },

    driverProfile: {
      phone: String,
      licenseNumber: String,
      rickshawNumber: String,
      idDocUrl: String,
    },

    businessProfile: {
      companyName: String,
      contactPerson: String,
      phone: String,
      address: String,
      gst: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
