import { Conversation } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return AppError(res, 400, "Missing userId");

    const conver = await Conversation.findOne({
      $or: [
        { user1: req.user.id, user2: userId },
        { user1: userId, user2: req.user.id },
      ],
    })
      .populate("user1", "name email")
      .populate("user2", "name email")
    if (!conver) {
      // create new
      const newCon = await Conversation.create({
        user1: req.user.id,
        user2: userId,
      });

      // populate riêng từng field
      await newCon.populate("user1", "name email");
      await newCon.populate("user2", "name email");

      return successRes(res, { data: newCon });
    }

    successRes(res, { data: conver });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
