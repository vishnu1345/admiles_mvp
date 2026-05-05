import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import mongoose from "mongoose";

// Driver Earnings Pipeline (Mileage Calculation)
export const getDriverEarnings = async (req, res) => {
  try {
    const { driverId } = req.params;

    const earnings = await Application.aggregate([
      // Stage 1: Match only approved applications for a driver
      { $match: { driver: new mongoose.Types.ObjectId(driverId), status: "approved" } },

      // Stage 2: Lookup the parent campaign to get earningPerKm
      {
        $lookup: {
          from: "campaigns",
          localField: "campaign",
          foreignField: "_id",
          as: "campaignData",
        },
      },
      { $unwind: "$campaignData" },

      // Stage 3: Lookup payment records linked to this application
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "applicationId",
          as: "payouts",
        },
      },

      // Stage 4: Calculate total paid out and total distance covered
      {
        $project: {
          campaignName: "$campaignData.title",
          ratePerKm: "$campaignData.earningPerKm",
          totalDistance: { $sum: "$payouts.distanceCoveredKm" },
          totalEarned: { $sum: "$payouts.amount" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: earnings });
  } catch (error) {
    console.error("Error calculating driver earnings:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Campaign ROI Pipeline
export const getCampaignROI = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const roi = await Application.aggregate([
      { $match: { campaign: new mongoose.Types.ObjectId(campaignId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          verifiedDrivers: {
            $sum: { $cond: [{ $eq: ["$photoVerified", true] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: roi });
  } catch (error) {
    console.error("Error calculating campaign ROI:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
