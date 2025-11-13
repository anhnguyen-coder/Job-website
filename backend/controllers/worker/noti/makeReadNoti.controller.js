import { Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const makeReadNotiController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notiId, isMarkReadAll } = req.body;

    if (isMarkReadAll) {
      await withTransaction(async (session) => {
        await Notification.updateMany(
          { userId },
          { $set: { isRead: true } },
          { session }
        );
      });

      return successRes(res, { message: "All notifications marked as read" });
    }

    if (!notiId) {
      return AppError(res, 400, "Notification ID is required");
    }

    const updated = await Notification.updateOne(
      { _id: notiId, userId },
      { $set: { isRead: true } }
    );

    if (updated.matchedCount === 0) {
      return AppError(res, 404, "Notification not found");
    }

    successRes(res, { message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    AppError(res, 500, error?.message || "Internal server error");
  }
};
