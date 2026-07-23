import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { QUEUE_NAME } from "../queues/campaignQueue.js";
import Campaign from "../models/Campaign.js";

export const initCampaignWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const { campaignId } = job.data;
      console.log(`⏰ [Worker] Processing expiration for campaign: ${campaignId}`);

      const campaign = await Campaign.findById(campaignId);

      if (!campaign) {
        console.warn(`⚠️ [Worker] Campaign ${campaignId} not found. Skipping.`);
        return;
      }

      // Idempotency check: only expire if campaign is still active or in-progress
      if (campaign.status === "completed" || campaign.status === "expired") {
        console.log(`ℹ️ [Worker] Campaign ${campaignId} is already '${campaign.status}'. No action needed.`);
        return;
      }

      campaign.status = "expired";
      await campaign.save();

      console.log(`✅ [Worker] Campaign ${campaignId} successfully marked as EXPIRED.`);
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`🎉 [Worker] Job ${job.id} completed successfully.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`💥 [Worker] Job ${job?.id} failed with error:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("❌ [Worker] Connection/Redis error:", err.message);
  });

  return worker;
};
