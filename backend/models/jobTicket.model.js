import mongoose from "mongoose";

const jobTicketSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["issue", "feedback", "other"],
      required: true,
    },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("JobTicket", jobTicketSchema);
