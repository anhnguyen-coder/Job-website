import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const deleteMessageController = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const message = await Message.findOne({
      _id: messageId,
      senderId: req.user.id,
    });

    if (!message) return AppError(res, 404, "Message not found");

    await message.deleteOne();
    successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
