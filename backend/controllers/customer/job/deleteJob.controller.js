import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      throw AppError(res, 401, "User authentication failed.");
    }

    const job = await Job.findOne({ _id: jobId, customerId });

    if (!job) {
      throw AppError(res, 404, "Job not found or does not belong to you.");
    }

    if (job && job.status !== "available") {
      return AppError(
        res,
        400,
        "Cannot delete a job that has already been taken."
      );
    }

    await Job.deleteOne({ _id: jobId, customerId });

    return successRes(res, { status: 200, data: null });
  } catch (error) {
    next(error);
  }
};
