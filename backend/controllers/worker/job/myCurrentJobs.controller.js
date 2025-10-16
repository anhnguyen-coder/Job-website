import { JOB_REQUEST_STATUS } from "../../../enums/job.enum.js";
import { JobRequest } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const myCurrentJobs = async (req, res, next) => {
  try {
    const workerId = req.user.id;

    const { status } = req.query;
    if (status && !Object.values(JOB_REQUEST_STATUS).includes(status)) {
      return AppError(400, "Invalid status value");
    }

    const { page, limit, skip } = getPagination(req.query);

    const filter = { workerId: workerId };
    if (status) {
      filter.status = status;
    }

    const [jobs, total] = await Promise.all([
      JobRequest.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("jobId")
        .populate("customerId", "name email"),
      JobRequest.countDocuments({ workerId: workerId }),
    ]);

    const pagy = getPagingData(total, page, limit);

    return successRes(res, { data: jobs, pagy: pagy });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
