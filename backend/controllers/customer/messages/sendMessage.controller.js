import { AppError } from "../../../pkg/helper/errorHandler.js";
import { Attachment, Conversation, Message } from "../../../models/index.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { MESSAGE_TYPE_ENUMS } from "../../../enums/message.js";
import successRes from "../../../pkg/helper/successRes.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { message: content, conversationId, userId } = req.body;

    if (!content && (!req.files || req.files.length === 0)) {
      return AppError(res, 400, "Cannot send empty message");
    }

    if (!conversationId)
      return AppError(res, 400, "conversationId is required");

    await withTransaction(async (session) => {
      const conversation = await createOrGetConversation(
        userId,
        senderId,
        conversationId,
        session
      );

      const messageDoc = await createMessageWithAttachments(
        conversation._id,
        senderId,
        content,
        req.files,
        session
      );

      await messageDoc.populate("senderId", "name");
      conversation.lastMessage = messageDoc._id;
      conversation.updatedAt = new Date();
      await conversation.save({ session });

      return successRes(res, { data: messageDoc });
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const createOrGetConversation = async (
  user1,
  user2,
  conversationId,
  session
) => {
  let conversation = await Conversation.findOne({
    $or: [
      {
        user1: mongoose.Types.ObjectId.createFromHexString(user1),
        user2: mongoose.Types.ObjectId.createFromHexString(user2),
        _id: conversationId,
      },
      {
        user1: mongoose.Types.ObjectId.createFromHexString(user2),
        user2: mongoose.Types.ObjectId.createFromHexString(user1),
        _id: conversationId,
      },
    ],
  }).session(session);

  if (!conversation) {
    conversation = await Conversation.create(
      [
        {
          user1,
          user2,
        },
      ],
      { session }
    );
    conversation = conversation[0];
  }

  return conversation;
};

const createAttachments = async (files, messageId, uploaderId, session) => {
  if (!files || files.length === 0) return [];

  const attachmentIds = await Promise.all(
    files.map(async (file) => {
      const attachment = await Attachment.create(
        [
          {
            messageId,
            uploaderId,
            fileType: file.mimetype.split("/")[0], // image/video/audio/file
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            url: file.path,
            thumbnailUrl: file.path,
          },
        ],
        { session }
      );
      return attachment[0]._id;
    })
  );

  return attachmentIds;
};

const createMessageWithAttachments = async (
  conversationId,
  senderId,
  content,
  files,
  session
) => {
  let messageType = MESSAGE_TYPE_ENUMS[0];

  if (files && files.length > 0) {
    const mainFileType = files[0].mimetype.split("/")[0];
    messageType = Object.values(MESSAGE_TYPE_ENUMS).includes(mainFileType)
      ? mainFileType
      : MESSAGE_TYPE_ENUMS.FILE;
  }

  const messageDoc = (
    await Message.create(
      [
        {
          conversationId,
          senderId,
          messageType,
          content: content || "",
          attachments: [],
        },
      ],
      { session }
    )
  )[0];

  const attachmentIds = await createAttachments(
    files,
    messageDoc._id,
    senderId,
    session
  );
  if (attachmentIds.length > 0) {
    messageDoc.attachments = attachmentIds;
    await messageDoc.save({ session });
  }

  return messageDoc;
};
