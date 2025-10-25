import mongoose from "mongoose";

const jobTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 150,
    required: true,
  },
  description: {
    type: String,
    maxlength: 2000,
    required: false,
  },

  isCompleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const jobTask = mongoose.model("JobTask", jobTaskSchema);
export default jobTask;
