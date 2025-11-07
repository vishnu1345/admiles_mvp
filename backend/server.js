import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import { isAuthed, requireRole } from "./middleware/auth.js";

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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      sameSite: "lax", // in production with HTTPS consider 'none' + secure: true
      
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"));

app.use("/auth", authRoutes);

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
