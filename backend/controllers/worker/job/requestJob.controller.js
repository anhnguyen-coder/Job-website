import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const requestJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return AppError(404, "Job not found");
    }

    if (job.status !== JOB_STATUS.AVAILABLE) {
      return AppError(400, "Job is not available for request");
    }

    job.status = JOB_STATUS.PENDING_REQUEST;
    job.assignedWorkerId = workerId;
    await job.save();
    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    AppError(500, "Server Error");
  }
};
