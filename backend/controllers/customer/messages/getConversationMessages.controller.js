import mongoose from "mongoose";
import { Conversation, Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;

    const convId = mongoose.Types.ObjectId.createFromHexString(conversationId);

    const conversation = await Conversation.findById(convId).lean();
    if (!conversation) {
      return successRes(res, { data: null });
    }

    const { page, skip, limit } = getPagination(req.query);

    const [messages, total] = await Promise.all([
      Message.find({ conversationId: convId })
        .sort({ createdAt: -1 }) // mới nhất trước
        .skip(skip)
        .limit(limit)
        .populate("senderId", "name")
        .populate("repliedToMsg", "content")
        .populate("attachments")
        .lean(),
      Message.countDocuments({ conversationId: convId }),
    ]);

    const messagesForUI = messages.reverse();

    const pagy = getPagingData(total, page, limit);

    // if message length > 0
    const currentUserId = req.user.id;

    if (messages.length > 0) {
      await withTransaction(async (session) => {
        await Message.updateMany(
          {
            _id: { $in: messages.map((msg) => msg._id) },
            senderId: { $ne: currentUserId },
          },
          { $set: { isRead: true, updatedAt: new Date() } },
          { session }
        );
      });
    }

    successRes(res, {
      data: messagesForUI,
      pagy: pagy,
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
