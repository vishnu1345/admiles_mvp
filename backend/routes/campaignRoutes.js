import express from "express";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";
import { deleteCampaign } from "../controllers/campaignController.js";
import { upload } from "../config/upload.js";
import { scheduleCampaignExpiration } from "../queues/campaignQueue.js";

const router = express.Router();


router.delete("/:id", isAuthed, requireRole("business"), deleteCampaign);

router.put("/complete/:id", isAuthed, requireRole("business"), async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, agency: req.user._id },
      { status: "completed" },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json({ message: "Campaign marked as completed", campaign });
  } catch (err) {
    res.status(500).json({ message: "Error completing campaign" });
  }
});


router.post(
  "/",
  isAuthed,
  requireRole("business"),
  upload.single("image"), // field name must match frontend
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        location,
        duration,
        earningPerKm,
        totalBudget,
        targetDrivers,
        requirements,
        contactEmail,
        contactPhone,
      } = req.body;

      const imageUrl = req.file?.path || "";
      const imagePublicId = req.file?.filename || "";

      const durationDays = Number(duration) || 1;
      const startDate = new Date();
      const delayMs = durationDays * 24 * 60 * 60 * 1000;
      const endDate = new Date(startDate.getTime() + delayMs);

      const newCampaign = await Campaign.create({
        title,
        category,
        description,
        location,
        duration: durationDays,
        earningPerKm,
        totalBudget,
        targetDrivers,
        requirements,
        contactEmail,
        contactPhone,
        imageUrl,
        imagePublicId,
        agency: req.user._id,
        startDate,
        endDate,
      });

      // Schedule automatic expiration in BullMQ
      try {
        await scheduleCampaignExpiration(newCampaign._id.toString(), delayMs);
        console.log(`📌 Scheduled expiration job for campaign ${newCampaign._id} in ${durationDays} days (${delayMs}ms)`);
      } catch (queueErr) {
        console.error("⚠️ Failed to schedule BullMQ expiration job:", queueErr.message);
      }

      res.status(201).json(newCampaign);
    } catch (err) {
      console.error("Error creating campaign:", err);
      res.status(500).json({ message: "Error creating campaign" });
    }
  }
);


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

router.get("/all", async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate(
      "agency",
      "businessProfile.companyName"
    );
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all campaigns" });
  }
});

export default router;
