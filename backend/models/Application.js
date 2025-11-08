import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedDate: { type: Date, default: Date.now },
    startedDate: { type: Date },
    photoVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
