import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateMessageController = async (req, res) => {
  try {
    const { messageId, content } = req.body;

    if (!messageId || !content)
      return AppError(res, 400, "Missing required fields");

    const userId = req.user.id;

    const message = await Message.findOne({ senderId: userId, _id: messageId });

    if (!message) return AppError(res, 404, "Error: message not found");

    message.content = content;
    await message.save({ session: session });

    successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
