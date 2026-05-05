import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    speed: { type: Number, default: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
trackingSchema.index({ location: "2dsphere" });

// TTL index to automatically delete raw pings after 30 days (2592000 seconds)
trackingSchema.index({ recordedAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model("Tracking", trackingSchema);
