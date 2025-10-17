import successRes from "../../../pkg/helper/successRes.js";
import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const workerId = req.user?.id;

    validation(messageId, message, res);

    const messageToUpdate = await Message.findById(messageId);
    if (!messageToUpdate) {
      return AppError(res, 404, "Message not found");
    }
    if (messageToUpdate.senderId.toString() !== workerId) {
      return AppError(
        res,
        403,
        "You are not authorized to update this message"
      );
    }

    messageToUpdate.message = message;
    await messageToUpdate.save();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validation = (messageId, message, res) => {
  if (!messageId) {
    return AppError(res, 400, "Message ID is required");
  }
  if (!message) {
    return AppError(res, 400, "Message is required");
  }
};
