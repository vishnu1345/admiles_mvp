import express from "express";
import { isAuthed } from "../middleware/auth.js";
import {
  getDriverEarnings,
  getCampaignROI,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/driver/:driverId", isAuthed, getDriverEarnings);
router.get("/campaign/:campaignId", isAuthed, getCampaignROI);

export default router;
