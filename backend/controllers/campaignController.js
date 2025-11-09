import Campaign from "../models/Campaign.js";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

   
    await Application.deleteMany({ campaign: campaign._id });

   
    if (campaign.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(campaign.imagePublicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed:", e?.message || e);
      }
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
