import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["driver", "business"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
