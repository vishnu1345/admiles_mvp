import express from "express";
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
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());



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
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"));

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
