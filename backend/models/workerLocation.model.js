import mongoose from "mongoose";

const workerLocationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model("WorkerLocation", workerLocationSchema);
