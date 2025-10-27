import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { Message } from "../../../models/index.js";

export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body;
    const customerId = req.user?.id;

    if (!messageId) {
      throw new AppError(400, "Message ID is required.");
    }

    if (!customerId) {
      throw new AppError(401, "User authentication failed.");
    }

    const messageToDelete = await Message.findById(messageId);

    if (!messageToDelete) {
      throw new AppError(404, "Message not found.");
    }

    if (String(messageToDelete.senderId) !== String(customerId)) {
      throw new AppError(403, "You are not authorized to delete this message.");
    }

    await messageToDelete.deleteOne();

    return successRes(res, {
      status: 200,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
