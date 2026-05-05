import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    photoUrl: { type: String, required: true },
    verifiedStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    flagged: { type: Boolean },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Sparse index: only indexes documents where `flagged` is present
verificationSchema.index({ flagged: 1 }, { sparse: true });

export default mongoose.model("Verification", verificationSchema);
