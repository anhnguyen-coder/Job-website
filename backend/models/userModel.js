import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  role: { type: String, enum: ["customer", "worker"], required: true },
  
  // profile details
  profileImage: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  about: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  skills: [{ type: String }],

  experience: { type: String, default: "" }, // For workers
  isAvailable: { type: Boolean, default: true }, // For workers
  hourlyRate: { type: Number, default: 0 }, // For workers
  totalEarnings: { type: Number, default: 0 }, // For workers
  totalJobsCompleted: { type: Number, default: 0 }, // For workers

  totalJobsPosted: { type: Number, default: 0 }, // For customers
  createdAt: { type: Date, default: Date.now },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
