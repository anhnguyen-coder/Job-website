import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;
    const { status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return AppError(404, "Job not found");
    }

    if (job.assignedWorkerId.toString() !== workerId) {
      return AppError(403, "You are not assigned to this job");
    }

    if (!["in_progress", "completed", "cancelled"].includes(status)) {
      return AppError(400, "Invalid status update");
    }

    job.status = status;
    await job.save();
    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
