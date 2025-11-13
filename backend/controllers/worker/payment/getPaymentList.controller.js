import { Payment, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const paymentList = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [payments, total] = await Promise.all([
      Payment.find({ workerId: req.user.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .populate("customerId", "name email")
        .populate("workerId", "name email")
        .populate("jobId", "title"),

      Payment.countDocuments({ workerId: req.user.id }),
    ]);

    const pagy = getPagingData(total, page, limit);

    successRes(res, { data: payments, pagy: pagy });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
