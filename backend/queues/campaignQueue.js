import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const QUEUE_NAME = "campaign-expiration";

export const campaignQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true, // Auto-clean completed jobs from Redis memory
    removeOnFail: 100,      // Keep last 100 failed jobs for debugging
    attempts: 3,            // Retry up to 3 times on unexpected failure
    backoff: {
      type: "exponential",
      delay: 1000,          // Retry after 1s, 2s, 4s...
    },
  },
});

/**
 * Schedule a campaign expiration job
 * @param {string} campaignId - Mongo ObjectId of the campaign
 * @param {number} delayMs - Delay in milliseconds until expiration
 */
export const scheduleCampaignExpiration = async (campaignId, delayMs) => {
  return await campaignQueue.add(
    "expire-campaign",
    { campaignId },
    {
      delay: delayMs,
      jobId: `expire-${campaignId}`, // Deduplication / easy lookup
    }
  );
};
