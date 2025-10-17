import { Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const viewProfileRating = async (req, res) => {
  const workerId = req.user.id;
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [ratings, total] = await Promise.all([
      Rating.find({
        targetId: workerId,
        targetType: "worker",
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Rating.countDocuments({
        targetId: workerId,
        targetType: "worker",
      }),
    ]);

    const pagy = getPagingData(total, page, limit);

    return successRes(res, { data: ratings, pagy: pagy });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
