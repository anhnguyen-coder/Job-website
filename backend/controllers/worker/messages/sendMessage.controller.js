import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { Job, Message, User } from "../../../models/index.js";

export const sendMessage = async (req, res) => {
  try {
    const { jobId, customerId, message } = req.body;
    const workerId = req.user?.id;

    await validation(jobId, customerId, message, res);

    const newMessage = await Message.create({
      jobId: jobId,
      senderId: workerId,
      receiverId: customerId,
      message: message,
    });

    return successRes(res, { data: newMessage });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validation = async (jobId, customerId, message, res) => {
  if (!jobId) {
    return AppError(res, 400, "Job ID is required");
  }
  if (!customerId) {
    return AppError(res, 400, "Customer ID is required");
  }
  if (!message) {
    return AppError(res, 400, "Message is required");
  }

  await validateCustomerId(customerId, res);
  await validateJobId(jobId, res);
};

const validateCustomerId = async (customerId, res) => {
  const customer = await User.findById(customerId);
  if (!customer) {
    return AppError(res, 404, "Customer not found");
  }
};

const validateJobId = async (jobId, res) => {
  const job = await Job.findById(jobId);
  if (!job) {
    return AppError(res, 404, "Job not found");
  }
};
