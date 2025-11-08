import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";
import { deleteCampaign } from "../controllers/campaignController.js";

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Created uploads directory");
}

// Setup storage folder for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.delete("/:id", deleteCampaign);

router.post(
  "/",
  isAuthed,
  requireRole("business"),
  upload.single("image"),
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
      } = req.body;

      const newCampaign = await Campaign.create({
        title,
        category,
        description,
        location,
        duration,
        earningPerKm,
        totalBudget,
        targetDrivers,
        requirements,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        agency: req.user._id,
      });

      res.json(newCampaign);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating campaign" });
    }
  }
);

// Get all campaigns for this business
router.get("/", isAuthed, requireRole("business"), async (req, res) => {
  const campaigns = await Campaign.find({ agency: req.user._id });
  res.json(campaigns);
});

// Get all campaigns (for drivers)
router.get("/all", async (req, res) => {
  const campaigns = await Campaign.find().populate(
    "agency",
    "businessProfile.companyName"
  );
  res.json(campaigns);
});

export default router;
