import express from "express";
import { isAuthed } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/driver", isAuthed, async (req, res) => {
  try {
    const { phone, licenseNumber, rickshawNumber, idDocUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.completed)
      return res.status(400).json({ message: "Profile already completed" });

    user.driverProfile = { phone, licenseNumber, rickshawNumber, idDocUrl };
    user.completed = true;
    await user.save();

    return res.json({ message: "Driver registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/business", isAuthed, async (req, res) => {
  try {
    const { companyName, contactPerson, phone, address, gst } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.completed)
      return res.status(400).json({ message: "Profile already completed" });

    user.businessProfile = { companyName, contactPerson, phone, address, gst };
    user.completed = true;
    await user.save();

    return res.json({ message: "Business registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
