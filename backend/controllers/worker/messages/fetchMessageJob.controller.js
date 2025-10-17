import { Job, Message, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const fetchMessagesJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const workerId = req.user.id;
    const { customerId } = req.query;

    await validateJobAndCustomer(jobId, customerId);

    const messages = await Message.find({
      jobId: jobId,
      senderId: customerId,
      receiverId: workerId,
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: 1 });

    if (!messages.length) {
      return AppError(res, 404, "No messages found for this job");
    }

    const unreadMessageIds = messages
      .filter(
        (msg) => msg.senderId._id.toString() === customerId && !msg.isRead
      )
      .map((msg) => msg._id);

    if (unreadMessageIds.length) {
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { isRead: true }
      );
    }

    return successRes(res, messages);
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

const validateJobAndCustomer = async (jobId, customerId) => {
  if (!jobId) return AppError("Job ID is required", 400);
  if (!customerId) return AppError("Customer ID is required", 400);

  const [job, customer] = await Promise.all([
    Job.findById(jobId),
    User.findById(customerId),
  ]);

  if (!job) return AppError("Job not found", 404);
  if (!customer) return AppError("Customer not found", 404);
};
