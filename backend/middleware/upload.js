import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "messages", // folder trong Cloudinary
      resource_type: "auto", // auto detect image/video/audio
      public_id: `${Date.now()}_${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
