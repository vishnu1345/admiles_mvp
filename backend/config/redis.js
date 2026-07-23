import dotenv from "dotenv";
dotenv.config();

const useTLS =
  process.env.REDIS_TLS === "true" ||
  (process.env.REDIS_HOST && process.env.REDIS_HOST.includes("upstash.io"));

export const redisConnection = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
    }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null, // Required by BullMQ for blocking connections
      ...(useTLS && { tls: { rejectUnauthorized: false } }),
    };

