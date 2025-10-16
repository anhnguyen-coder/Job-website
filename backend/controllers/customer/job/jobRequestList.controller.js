import { JOB_REQUEST_STATUS } from "../../../enums/job.enum.js";
import { JobRequest } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobRequestList = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    const { status } = req.query;

    if (!customerId) {
      throw AppError(res, 401, "Không xác thực được người dùng.");
    }

    if (status && !Object.values(JOB_REQUEST_STATUS).includes(status)) {
      return AppError(res, 400, "Invalid status value");
    }

    const filter = { customerId: customerId };
    if (status) {
      filter.status = status;
    }

    const { page, limit, skip } = getPagination(req.query);
    const [jobs, total] = await Promise.all([
      JobRequest.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("workerId", "name email phone")
        .populate("jobId"),
      JobRequest.countDocuments(filter),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, { data: jobs, status: 200, pagy: pagination });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
