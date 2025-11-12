import { deleteFromCloudinary } from "../../../config/cloudinary.js";
import { Attachment, Message } from "../../../models/index.js";
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

    if (message.attachments && message.attachments.length > 0) {
      const attachments = await Attachment.find({
        _id: { $in: message.attachments },
      });

      if (attachments.length > 0) {
        await Promise.all(
          attachments.map(async (att) => {
            try {
              await deleteFromCloudinary(att.url);
            } catch (error) {
              console.error("Error deleting from Cloudinary:", error);
              return AppError(res, 400, error.message);
            }
          })
        );

        await Attachment.deleteMany({
          _id: { $in: attachments.map((a) => a._id) },
        });
      }
    }

    await message.deleteOne();
    successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
