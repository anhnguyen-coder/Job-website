import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      index: true,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileType: {
      type: String,
      enum: ["image", "video", "file", "audio", "text", "application"],
      required: true,
    },
    fileName: String,
    fileSize: Number, // bytes
    mimeType: String,
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Attachment", attachmentSchema);
