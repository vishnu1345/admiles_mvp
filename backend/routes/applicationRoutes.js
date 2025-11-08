import express from "express";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";

const router = express.Router();


router.post(
  "/:campaignId",
  isAuthed,
  requireRole("driver"),
  async (req, res) => {
    try {
      const campaignId = req.params.campaignId;

      //  check if driver already has one active campaign
      const active = await Application.findOne({
        driver: req.user._id,
        status: "approved",
      });
      if (active)
        return res
          .status(400)
          .json({ message: "You already have an active campaign." });

      //  prevent duplicate applications
      const existing = await Application.findOne({
        driver: req.user._id,
        campaign: campaignId,
      });
      if (existing)
        return res
          .status(400)
          .json({ message: "Already applied to this campaign." });

      //  create new application
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

/* ---------- DRIVER: BROWSE ALL CAMPAIGNS ---------- */
router.get("/browse", isAuthed, requireRole("driver"), async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("agency", "name email");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});


router.get(
  "/business/all",
  isAuthed,
  requireRole("business"),
  async (req, res) => {
    try {
      // find campaigns owned by this business
      const myCampaigns = await Campaign.find({ agency: req.user._id });
      const campaignIds = myCampaigns.map((c) => c._id);

      // find applications for these campaigns
      const applications = await Application.find({
        campaign: { $in: campaignIds },
      })
        .populate("driver", "name email")
        .populate("campaign", "title earningPerKm location duration");

      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching driver applications" });
    }
  }
);


router.put(
  "/approve/:id",
  isAuthed,
  requireRole("business"),
  async (req, res) => {
    try {
      const appId = req.params.id;

      // find the application
      const application = await Application.findById(appId).populate("driver");
      if (!application) return res.status(404).json({ message: "Not found" });

      // ensure driver has no active campaign
      const active = await Application.findOne({
        driver: application.driver._id,
        status: "approved",
      });
      if (active)
        return res
          .status(400)
          .json({ message: "Driver already has an active campaign." });

      // approve it
      application.status = "approved";
      application.startedDate = new Date();
      await application.save();

      res.json({ message: "Application approved successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error approving application" });
    }
  }
);

export default router;
