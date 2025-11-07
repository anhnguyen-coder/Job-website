import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobDetails = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return AppError(res, 400, "Job ID is required.");
    }

    const job = await Job.findById(jobId)
      .populate("customerId", "name email")
      .populate("categories", "name")
      .populate("assignedWorkerId", "name email")
      .populate("jobTasks");

    if (!job) {
      return AppError(res, 404, "Job not found.");
    }

    return successRes(res, {
      status: 200,
      data: job,
    });
  } catch (error) {
    AppError(res, 500, error.message || "Server Error");
  }
};
