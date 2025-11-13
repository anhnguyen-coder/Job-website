import { Notification, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const getNotiListController = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page, limit, skip } = getPagination(req.query);

    const [notis, total] = await Promise.all([
      Notification.find({ userId: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Notification.countDocuments({ userId: userId }),
    ]);

    const pagy = getPagingData(total, page, limit);

    successRes(res, { data: notis, pagy: pagy });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
