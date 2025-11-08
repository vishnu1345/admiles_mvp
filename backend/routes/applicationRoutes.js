import express from "express";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";

const router = express.Router();


router.post(
  "/:campaignId",
  isAuthed,
  requireRole("driver"),
  async (req, res) => {
    try {
      const campaignId = req.params.campaignId;

    
      const existing = await Application.findOne({
        driver: req.user._id,
        campaign: campaignId,
      });
      if (existing)
        return res
          .status(400)
          .json({ message: "Already applied to this campaign" });

      const application = await Application.create({
        driver: req.user._id,
        campaign: campaignId,
      });

      res.json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error applying to campaign" });
    }
  }
);


router.get("/", isAuthed, requireRole("driver"), async (req, res) => {
  try {
    const applications = await Application.find({ driver: req.user._id })
      .populate("campaign")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});


router.get("/browse", isAuthed, requireRole("driver"), async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("agency", "name email");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});

export default router;
