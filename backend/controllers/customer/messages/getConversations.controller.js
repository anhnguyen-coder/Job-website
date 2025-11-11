import mongoose from "mongoose";
import { Conversation } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page, limit, skip } = getPagination(req.query);

    const [messages, total] = await Promise.all([
      Conversation.find({
        $or: [
          { user1: mongoose.Types.ObjectId.createFromHexString(userId) },
          { user2: mongoose.Types.ObjectId.createFromHexString(userId) },
        ],
      })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user1", "name email")
        .populate("user2", "name email")
        .populate("lastMessage", "content")
        .lean(),

      Conversation.countDocuments({
        $or: [
          { user1: mongoose.Types.ObjectId.createFromHexString(userId) },
          { user2: mongoose.Types.ObjectId.createFromHexString(userId) },
        ],
      }),
    ]);

    const pagy = getPagingData(total, page, limit);

    successRes(res, {
      data: messages,
      pagy: pagy,
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
