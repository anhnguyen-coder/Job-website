import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const requestJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return AppError(res, 404, "Job not found");
    }

    if (job.status !== JOB_STATUS.AVAILABLE) {
      return AppError(res, 400, "Job is not available for request");
    }

    const hasRequested = await JobRequest.findOne({
      jobId: jobId,
      workerId: workerId,
    });

    if (hasRequested)
      return AppError(
        res,
        400,
        "You have already applied this job, please wait for customer approve!"
      );

    const jobRequest = new JobRequest({
      jobId: job._id,
      workerId: workerId,
      customerId: job.customerId,
      status: JOB_REQUEST_STATUS.PENDING,
    });

    await jobRequest.save();

    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    AppError(500, "Server Error");
  }
};
