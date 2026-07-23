import Campaign from "../models/Campaign.js";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";
import { campaignQueue } from "../queues/campaignQueue.js";

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Delete associated applications
    await Application.deleteMany({ campaign: campaign._id });

    // Remove Cloudinary image
    if (campaign.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(campaign.imagePublicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed:", e?.message || e);
      }
    }

    // Remove delayed BullMQ job if present
    try {
      const job = await campaignQueue.getJob(`expire-${campaign._id}`);
      if (job) {
        await job.remove();
        console.log(`🗑️ Removed scheduled expiration job for campaign ${campaign._id}`);
      }
    } catch (queueErr) {
      console.warn("Could not remove BullMQ job:", queueErr.message);
    }

    await campaign.deleteOne();

    res.json({
      message: "Campaign and related applications deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ message: "Error deleting campaign" });
  }
};
