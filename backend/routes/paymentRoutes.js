import express from "express";
import { isAuthed, requireRole } from "../middleware/auth.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Route to record a new payment/distance
router.post("/", isAuthed, requireRole("business"), async (req, res) => {
  try {
    const { applicationId, amount, distanceCoveredKm } = req.body;

    if (!applicationId || amount === undefined || distanceCoveredKm === undefined) {
      return res.status(400).json({ message: "Missing required payment data" });
    }

    const payment = new Payment({
      applicationId,
      amount,
      distanceCoveredKm,
      status: "processing",
    });

    await payment.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Error recording payment" });
  }
});

export default router;
