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
      return next(AppError(400, "Invalid status value"));
    }

    const { page, limit, skip } = getPagination(req.query);

    // Build filter for JobRequest (not for Job)
    const filter = { workerId };
    if (status) {
      filter.status = status;
    }

    // Find JobRequests, populate job details
    const [requests, total] = await Promise.all([
      JobRequest.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "jobId",
          populate: [
            {path: "jobTasks"}
          ]
        })
        .populate("customerId", "name email")
        .populate("workerId", "name email"),
      JobRequest.countDocuments(filter),
    ]);

    const pagy = getPagingData(total, page, limit);

    // Return full JobRequest + populated job info
    return successRes(res, {
      data: requests,
      pagy,
    });
  } catch (error) {
    AppError(res, 500, "Server Error");
  }
};
