// import Campaign from "../models/Campaign.js";

// export const deleteCampaign = async (req, res) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign)
//       return res.status(404).json({ message: "Campaign not found" });

//     await campaign.deleteOne();
//     res.json({ message: "Campaign deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting campaign" });
//   }
// };

import Campaign from "../models/Campaign.js";
import Application from "../models/Application.js"; 

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

   
    await Application.deleteMany({ campaign: campaign._id });

   
    await campaign.deleteOne();

    res.json({
      message: "Campaign and related applications deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ message: "Error deleting campaign" });
  }
};
