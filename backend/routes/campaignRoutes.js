import express from "express";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// Create new campaign
router.post("/", isAuthed, requireRole("business"), async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      agency: req.user._id,
    });
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating campaign" });
  }
});

// Get all campaigns created by this agency
router.get("/", isAuthed, requireRole("business"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ agency: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});

export default router;
