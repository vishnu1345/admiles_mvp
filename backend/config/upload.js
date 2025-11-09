import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "admiles/campaigns",
    // keep original name without extension + timestamp
    public_id: `${Date.now()}-${(file.originalname || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase()}`,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { quality: "auto:good", fetch_format: "auto" },
      { width: 1600, height: 1600, crop: "limit" },
    ],
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
