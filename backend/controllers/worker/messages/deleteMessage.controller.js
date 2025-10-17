import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { Message } from "../../../models/index.js";

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const workerId = req.user?.id;

    validation(messageId, res);

    const messageToDelete = await Message.findById(messageId);
    if (!messageToDelete) {
      return AppError(res, 404, "Message not found");
    }
    if (messageToDelete.senderId.toString() !== workerId) {
      return AppError(
        res,
        403,
        "You are not authorized to delete this message"
      );
    }

    await messageToDelete.deleteOne();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validation = (messageId, res) => {
  if (!messageId) {
    return AppError(res, 400, "Message ID is required");
  }
};
