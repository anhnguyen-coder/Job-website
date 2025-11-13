import { Notification, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const deleteNotiController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notiId } = req.params;
    if (!notiId) return AppError(res, 400, "NotiId is required");

    const noti = await Notification.findOne({ _id: notiId, userId: userId });
    if (!noti) {
      return AppError(res, 404, "Not found.");
    }

    await noti.deleteOne();

    successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
