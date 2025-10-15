import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobDetails = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, "Job ID is required.");
    }

    const job = await Job.findById(jobId)
      .populate("customerId", "name email")
      .populate("categories", "name")
      .populate("assignedWorkerId", "name email");

    if (!job) {
      throw new AppError(404, "Job not found.");
    }

    return successRes(res, {
      status: 200,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
