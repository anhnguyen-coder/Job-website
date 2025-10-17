import { Message, Job, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const fetchMessageJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const currentCustomerId = req.user?.id;
    const { workerId } = req.query;

    await validateJobAndWorker(jobId, workerId, currentCustomerId);

    const messages = await Message.find({
      jobId: jobId,
      senderId: currentCustomerId,
      receiverId: workerId,
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    if (!messages.length) {
      return AppError(res, 404, "No messages found for this job");
    }

    const unreadMessageIds = messages
      .filter((msg) => msg.senderId._id.toString() === workerId && !msg.isRead)
      .map((msg) => msg._id);

    if (unreadMessageIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { isRead: true }
      );
    }

    return successRes(res, { data: messages });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

const validateJobAndWorker = async (jobId, workerId, res) => {
  if (!jobId) return AppError(res, 400, "Job ID is required");
  if (!workerId) return AppError(res, 400, "Worker ID is required");

  const [job, worker] = await Promise.all([
    Job.findById(jobId),
    User.findById(workerId),
  ]);

  if (!job) return AppError(res, 404, "Job not found");
  if (!worker) return AppError(res, 404, "Worker not found");
};
