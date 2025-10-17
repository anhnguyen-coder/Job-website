import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "job_requested",
        "job_accepted",
        "job_status_changed",
        "new_message",
        "payment_received",
      ],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    urlRedirect: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
