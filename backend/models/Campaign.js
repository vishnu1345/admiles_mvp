import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    earningPerKm: { type: Number, required: true },
    totalBudget: { type: Number, required: true },
    targetDrivers: { type: Number, required: true },
    imageUrl: { type: String },
    requirements: { type: String },
    specialRequirements: { type: String },
    status: {
      type: String,
      enum: ["draft", "active", "in-progress", "completed", "expired"],
      default: "active",
    },
    imagePublicId: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, endDate: 1 });


campaignSchema.index({ location: 1, status: 1 });

export default mongoose.model("Campaign", campaignSchema);
