import express from "express"; // Restarting server
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import registerRoutes from "./routes/registerRoutes.js"
import { isAuthed, requireRole } from "./middleware/auth.js";
import campaignRoutes from "./routes/campaignRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js";
import { initCampaignWorker } from "./workers/campaignWorker.js";
import Campaign from "./models/Campaign.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://admiles.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};
console.log("Cookie Options:", cookieOptions);


// Session store in Mongo (so sessions survive restarts)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 15 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      ...(process.env.NODE_ENV === "production" && {
        domain: "admiles-server.onrender.com",
        secure: true,
        sameSite: "none",
      }),
    },

    proxy: process.env.NODE_ENV === "production",
  })
);

app.use(passport.initialize());
app.use(passport.session());


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo connected");

    // 1. Initialize BullMQ worker
    try {
      initCampaignWorker();
      console.log("🚀 BullMQ Campaign Expiration Worker initialized");
    } catch (err) {
      console.error("⚠️ Failed to initialize BullMQ worker:", err.message);
    }

    // 2. Startup Reconciliation: Catch any campaigns that expired while server/Redis was offline
    try {
      const reconciled = await Campaign.updateMany(
        {
          status: { $in: ["active", "in-progress"] },
          endDate: { $lte: new Date() },
        },
        { status: "expired" }
      );
      if (reconciled.modifiedCount > 0) {
        console.log(`🔄 [Reconciliation] Marked ${reconciled.modifiedCount} overdue campaign(s) as EXPIRED.`);
      }
    } catch (recErr) {
      console.error("⚠️ Startup reconciliation error:", recErr.message);
    }
  });

  app.use((req, res, next) => {
    console.log("🔹 Incoming request:", req.method, req.path);
    console.log("🔹 Origin:", req.headers.origin);
    console.log("🔹 Cookies:", req.headers.cookie);
    console.log("🔹 Session ID:", req.sessionID);
    console.log("🔹 User:", req.user);
    next();
  });


app.use("/auth", authRoutes);
app.use('/api/register' , registerRoutes);
app.use('/api/campaigns' , campaignRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Example protected APIs
app.get("/api/driver/secret", isAuthed, requireRole("driver"), (req, res) => {
  res.json({ ok: true, data: "driver secret" });
});
app.get(
  "/api/business/secret",
  isAuthed,
  requireRole("business"),
  (req, res) => {
    res.json({ ok: true, data: "business secret" });
  }
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Backend on", port));
