import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/Application.js";
import Tracking from "./models/Tracking.js";
import Payment from "./models/Payment.js";
import Verification from "./models/Verification.js";
import Campaign from "./models/Campaign.js";
import User from "./models/User.js";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Find any approved application
    const application = await Application.findOne({ status: "approved" }).populate("campaign");

    if (!application) {
      console.log("❌ No 'approved' application found in the database.");
      console.log("Please create a campaign, apply as a driver, and approve the application first!");
      process.exit(1);
    }

    const appId = application._id;
    const driverId = application.driver;

    console.log(`Found approved application: ${appId} for driver: ${driverId}`);

    // Insert Dummy Tracking Data
    await Tracking.create([
      {
        applicationId: appId,
        driverId: driverId,
        location: { type: "Point", coordinates: [72.8777, 19.0760] }, // Mumbai
        speed: 45,
      },
      {
        applicationId: appId,
        driverId: driverId,
        location: { type: "Point", coordinates: [72.8800, 19.0800] },
        speed: 50,
      }
    ]);
    console.log("✅ Inserted 2 Tracking records.");

    // Insert Dummy Verification Data
    await Verification.create([
      {
        applicationId: appId,
        photoUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        verifiedStatus: "verified",
      },
      {
        applicationId: appId,
        photoUrl: "https://res.cloudinary.com/demo/image/upload/sample2.jpg",
        verifiedStatus: "pending",
        flagged: true,
      }
    ]);
    console.log("✅ Inserted 2 Verification records.");

    // Insert Dummy Payment Data
    const rate = application.campaign?.earningPerKm || 10;
    await Payment.create([
      {
        applicationId: appId,
        amount: rate * 15,
        distanceCoveredKm: 15,
        status: "paid",
      },
      {
        applicationId: appId,
        amount: rate * 8,
        distanceCoveredKm: 8,
        status: "processing",
      }
    ]);
    console.log("✅ Inserted 2 Payment records.");

    console.log("🎉 Seeding complete!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
