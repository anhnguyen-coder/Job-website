import mongoose from "mongoose";

export const paymentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "credit_card", "e_wallet"],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
paymentSchema.index({ customerId: 1, status: 1 });
paymentSchema.index({ workerId: 1, status: 1 });

// ✅ Auto-generate transactionId for demo purpose
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    this.transactionId = `TXN-${timestamp}-${randomPart}`;
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);
