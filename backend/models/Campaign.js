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
    specialRequirements: { type: String },
    status: { type: String, enum: ["draft", "active"], default: "draft" },
    imagePublicId : {type : String},
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
