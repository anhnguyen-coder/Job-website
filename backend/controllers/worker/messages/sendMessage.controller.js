// controllers/messageController.js
import { AppError } from "../../../pkg/helper/errorHandler.js";
import {
  Attachment,
  Conversation,
  Message,
  Notification,
} from "../../../models/index.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { MESSAGE_TYPE_ENUMS } from "../../../enums/message.js";
import successRes from "../../../pkg/helper/successRes.js";
import mongoose from "mongoose";
import { getIO, getOnlineUsers } from "../../../socket/index.js";
import multer from "multer";
import { uploadToCloudinary } from "../../../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

export const sendMessage = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) return AppError(res, 500, err.message);

      try {
        const senderId = req.user.id;
        const { message: content, conversationId, userId } = req.body;

        if (!content && (!req.files || req.files.length === 0))
          return AppError(res, 400, "Cannot send empty message");

        if (!conversationId)
          return AppError(res, 400, "conversationId is required");

        await withTransaction(async (session) => {
          const conversation = await createOrGetConversation(
            userId,
            senderId,
            conversationId,
            session
          );

          await conversation.populate("user1", "name email");
          await conversation.populate("user2", "name email");

          const messageDoc = await createMessageWithAttachments(
            conversation._id,
            senderId,
            content,
            req.files,
            session
          );

          await messageDoc.populate("senderId", "name");
          await messageDoc.populate("attachments");

          conversation.lastMessage = messageDoc._id;
          conversation.updatedAt = new Date();
          await conversation.save({ session });

          const receiver =
            conversation.user1._id.toString() === senderId
              ? conversation.user2
              : conversation.user1;

          const sender =
            conversation.user1._id.toString() === senderId
              ? conversation.user1
              : conversation.user2;

          const noti = await Notification.create(
            [
              {
                userId: receiver._id,
                type: "info",
                title: "New Message",
                content: `You have received a new message from user: ${sender.name}`,
              },
            ],
            { session }
          );

          const io = getIO();
          if (io) {
            io.to(conversationId).emit("receive_message", messageDoc);
            sendRefreshToUser(conversation.user1._id, io);
            sendRefreshToUser(conversation.user2._id, io);
            sendReceiveNotificationToUser(receiver._id, io, noti[0]);
          }

          return successRes(res, { data: messageDoc });
        });
      } catch (error) {
        AppError(res, 500, error.message);
      }
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

// ================== HELPERS ==================

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
    conversation = await Conversation.create([{ user1, user2 }], { session });
    conversation = conversation[0];
  }

  return conversation;
};

const createAttachments = async (files, messageId, uploaderId, session) => {
  if (!files || files.length === 0) return [];

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, file.originalname);
      return {
        fileType: file.mimetype.split("/")[0],
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        url: result.secure_url,
        thumbnailUrl: result.secure_url,
      };
    })
  );

  const attachments = await Attachment.create(
    uploadResults.map((fileData) => ({ messageId, uploaderId, ...fileData })),
    { session, ordered: true }
  );

  return attachments.map((a) => a._id);
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

const sendRefreshToUser = (userId, io) => {
  const onlineUsers = getOnlineUsers();
  const uid = userId.toString(); // convert sang string
  const sockets = onlineUsers.get(uid);

  if (sockets && sockets.length > 0) {
    sockets.forEach((socketId) => {
      io.to(socketId).emit("refresh_list_conv");
      console.log(
        `📨 Sent refresh_list_conv to user ${uid}, socketId: ${socketId}`
      );
    });
  } else {
    console.log(`⚠️ User ${uid} not online, cannot send refresh_list_conv`);
  }
};

const sendReceiveNotificationToUser = (userId, io, noti) => {
  const onlineUsers = getOnlineUsers();
  const uid = userId.toString();
  const sockets = onlineUsers.get(uid);

  if (sockets && sockets.length > 0) {
    sockets.forEach((socketId) => {
      io.to(socketId).emit("receive_notification", noti);
      console.log(
        `📨 Sent receive_notification to user ${uid}, socketId: ${socketId}`
      );
    });
  } else {
    console.log(`⚠️ User ${uid} not online, cannot send receive_notification`);
  }
};
