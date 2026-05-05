import express from "express";
import { isAuthed } from "../middleware/auth.js";
import Verification from "../models/Verification.js";

const router = express.Router();

// Route to submit a verification photo
router.post("/", isAuthed, async (req, res) => {
  try {
    const { applicationId, photoUrl } = req.body;

    if (!applicationId || !photoUrl) {
      return res.status(400).json({ message: "Missing required verification data" });
    }

    const verification = new Verification({
      applicationId,
      photoUrl,
    });

    await verification.save();

    res.status(201).json({ success: true, data: verification });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Error submitting verification" });
  }
});

// Route to get verifications with flagged status
router.get("/flagged", isAuthed, async (req, res) => {
  try {
    // Uses the sparse index to efficiently find flagged verifications
    const flaggedVerifications = await Verification.find({ flagged: true })
      .populate("applicationId");

    res.status(200).json({ success: true, data: flaggedVerifications });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Error fetching verifications" });
  }
});

export default router;
