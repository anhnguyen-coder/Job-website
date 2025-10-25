import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobs = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const filter = { customerId };

    if (req.query.status) {
      const statuses = req.query.status
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (statuses.length > 0) {
        filter.status = { $in: statuses };
      }
    }

    // ===== Pagination =====
    const { page, limit, skip } = getPagination(req.query);

    // ===== Query =====
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("jobTasks"),
      Job.countDocuments(filter),
    ]);

    const pagination = getPagingData(total, page, limit);

    // ===== Response =====
    return successRes(res, {
      data: jobs,
      pagy: pagination,
      status: 200,
    });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};
