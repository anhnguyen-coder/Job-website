import { Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const viewWorkerRates = async (req, res) => {
  const workerId = req.params.workerId;
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [ratings, total] = await Promise.all([
      Rating.find({
        targetId: workerId,
        targetType: "worker",
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Rating.countDocuments({
        targetId: workerId,
        targetType: "worker",
      }),
    ]);

    const pagination = getPagingData(total, page, limit);
    return successRes(res, { data: ratings, pagy: pagination });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
