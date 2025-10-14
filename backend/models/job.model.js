import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    location: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "available",
        "pending_request", // waiting for customer approval
        "job_accepted",
        "in_Progress",
        "completed",
        "cancelled",
      ],
      default: "available",
    },
    budget: { type: Number },
    assignedWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
