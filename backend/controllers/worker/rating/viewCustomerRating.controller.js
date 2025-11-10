import { Rating, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const viewCustomerRating = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId || customerId.trim().length === 0) {
      return AppError(res, 400, "Invalid customerId");
    }

    const customer = await User.findOne({ _id: customerId, role: "customer" });
    if (!customer) {
      return AppError(res, 404, "Customer not found");
    }

    const { page, limit, skip } = getPagination(req.query);

    const [ratings, total] = await Promise.all([
      Rating.find({
        targetId: customerId,
        targetType: "customer",
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("authorId", "name email")
        .populate("targetId", "name email")
        .populate("jobId", "title")
        .lean(),
      Rating.countDocuments({
        targetId: customerId,
        targetType: "customer",
      }),
    ]);

    const pagy = getPagingData(total, page, limit);

    successRes(res, { data: ratings, pagy: pagy });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
