import { Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobPendingRequestList = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const { page, limit, skip } = getPagination(req.query);
    const [jobs, total] = await Promise.all([
      Job.find({ customerId: customerId, status: "pending_request" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("assignedWorkerId"),
      Job.countDocuments({ customerId: customerId, status: "pending_request" }),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, { data: jobs, status: 200, pagy: pagination });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
