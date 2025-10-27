import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { jobId, workerId, message } = req.body;
    const customerId = req.user?.id;

    validation(jobId, workerId, message);

    const newMessage = await Message.create({
      jobId: jobId,
      senderId: customerId,
      receiverId: workerId,
      message: message,
    });

    return successRes(res, { data: newMessage });
  } catch (error) {
    next(error);
  }
};

const validation = (jobId, workerId, message) => {
  if (!jobId) {
    throw new AppError(400, "Job ID is required");
  }
  if (!workerId) {
    throw new AppError(400, "Worker ID is required");
  }
  if (!message) {
    throw new AppError(400, "Message is required");
  }
};
