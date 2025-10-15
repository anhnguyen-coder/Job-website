import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobApproval = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { status } = req.query;
    const customerId = req.user.id;

    if (
      status !== JOB_STATUS.JOB_ACCEPTED &&
      status !== JOB_STATUS.JOB_REJECTED
    ) {
      return AppError(res, 400, "Invalid status");
    }
    console.log(jobId);

    const job = await Job.find({ id: jobId, customerId: customerId });

    if (!job) {
      return AppError(res, 404, "Job not found");
    }

    if (job.status !== JOB_STATUS.PENDING_REQUEST) {
      return AppError(res, 400, "Job is not in pending request status");
    }

    job.status = status;
    await job.save();

    return successRes(res, { data: job, status: 200 });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};
