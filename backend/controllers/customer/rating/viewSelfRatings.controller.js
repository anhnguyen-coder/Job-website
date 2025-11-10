import mongoose from "mongoose";
import { Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const viewSelfRatingsController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const customerId = req.user.id;
    const id = mongoose.Types.ObjectId.createFromHexString(customerId);

    const [ratings, tota] = await Promise.all([
      Rating.find({
        targetType: "customer",
        targetId: id,
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("targetId", "name email")
        .populate("authorId", "name email")
        .populate("jobId", "title"),
      Rating.countDocuments({
        targetType: "customer",
        targetId: id,
      }),
    ]);

    const pagy = getPagingData(tota, page, limit);

    return successRes(res, { data: ratings, pagy: pagy });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
