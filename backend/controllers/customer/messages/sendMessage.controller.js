import { Message } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const sendMessage = async (req, res) => {
  try {
    const { jobId, workerId, message } = req.body;
    const customerId = req.user?.id;

    validation(jobId, workerId, message, res);

    const newMessage = await Message.create({
      jobId: jobId,
      senderId: customerId,
      receiverId: workerId,
      message: message,
    });

    return successRes(res, { data: newMessage });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validation = (jobId, workerId, message, res) => {
  if (!jobId) {
    return AppError(res, 400, "Job ID is required");
  }
  if (!workerId) {
    return AppError(res, 400, "Worker ID is required");
  }
  if (!message) {
    return AppError(res, 400, "Message is required");
  }
};
