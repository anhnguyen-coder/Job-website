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

jobSchema.pre("findOneAndDelete", async function (next) {
  const job = await this.model.findOne(this.getFilter());

  if (job) {
    await JobTask.deleteMany({ _id: { $in: job.jobTasks } });
  }

  next();
});

jobSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await JobTask.deleteMany({ _id: { $in: this.jobTasks } });
    next();
  }
);

export default mongoose.model("Job", jobSchema);
