import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateMessage = async (req, res) => {
  try {
    const { messageId, message } = req.body;
    const customerId = req.user?.id;

    validation(messageId, message);

    const messageToUpdate = await Message.findById(messageId);

    if (!messageToUpdate) {
      throw new AppError(404, "Message not found");
    }
    if (messageToUpdate.senderId !== customerId) {
      throw new AppError(403, "You are not authorized to update this message");
    }

    messageToUpdate.message = message;
    await messageToUpdate.save();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validation = (messageId, message) => {
  if (!messageId) {
    throw new AppError(400, "Message ID is required");
  }
  if (!message) {
    throw new AppError(400, "Message is required");
  }
};
