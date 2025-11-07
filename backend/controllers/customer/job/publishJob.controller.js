import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const publishJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return AppError(res, 401, "User authentication failed.");
    }

    const job = await Job.findOne({ _id: jobId, customerId });

    if (!job) {
      return AppError(res, 404, "Job not found or does not belong to you.");
    }

    if (job && job.status !== JOB_STATUS.CANCELLED) {
      return AppError(
        res,
        400,
        "Job is published"
      );
    }

    job.status = JOB_STATUS.AVAILABLE
    await job.save()

    return successRes(res, { status: 200, data: null });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
