import express from "express";
import { isAuthed } from "../middleware/auth.js";
import Tracking from "../models/Tracking.js";

const router = express.Router();

// Route to save a GPS ping
router.post("/ping", isAuthed, async (req, res) => {
  try {
    const { applicationId, longitude, latitude, speed } = req.body;

    if (!applicationId || longitude === undefined || latitude === undefined) {
      return res.status(400).json({ message: "Missing required tracking data" });
    }

    const newPing = new Tracking({
      applicationId,
      driverId: req.user._id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      speed: speed || 0,
    });

    await newPing.save();

    res.status(201).json({ success: true, data: newPing });
  } catch (error) {
    console.error("Tracking Error:", error);
    res.status(500).json({ message: "Error saving tracking ping" });
  }
});

export default router;
