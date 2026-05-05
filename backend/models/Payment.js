import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    amount: { type: Number, required: true },
    distanceCoveredKm: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "paid"],
      default: "pending",
    },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
