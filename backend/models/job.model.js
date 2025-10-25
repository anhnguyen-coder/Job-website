import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "available",
        "taken",
        "in_progress",
        "check_complete",
        "completed",
        "cancelled",
      ],
      default: "available",
      index: true,
    },
    budget: {
      type: Number,
      min: 0,
      default: 0,
    },
    jobTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobTask",
      },
    ],
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ customerId: 1, status: 1 });

export default mongoose.model("Job", jobSchema);
