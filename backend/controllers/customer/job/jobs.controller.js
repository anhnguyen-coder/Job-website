import { Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobs = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      throw new AppError(401, "Không xác thực được người dùng.");
    }

    const { page, limit, skip } = getPagination(req.query);
    const [jobs, total] = await Promise.all([
      Job.find({ customerId: customerId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Job.countDocuments(),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, {
      data: jobs,
      pagy: pagination,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
