import { Message, Job, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const fetchMessageJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { workerId } = req.query;
    const currentCustomerId = req.user?.id;

    if (!currentCustomerId) {
      throw new AppError(401, "User authentication failed.");
    }

    await validateJobAndWorker(jobId, workerId);

    // Fetch conversation between current customer and the worker for this job
    const messages = await Message.find({
      jobId,
      $or: [
        { senderId: currentCustomerId, receiverId: workerId },
        { senderId: workerId, receiverId: currentCustomerId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    if (messages.length === 0) {
      throw new AppError(404, "No messages found for this job.");
    }

    // Mark unread messages (sent by worker) as read
    const unreadMessageIds = messages
      .filter(
        (msg) =>
          msg.senderId._id.toString() === workerId && msg.isRead === false
      )
      .map((msg) => msg._id);

    await withTransaction(async (session) => {
      if (unreadMessageIds.length > 0) {
        await Message.updateMany(
          { _id: { $in: unreadMessageIds } },
          { isRead: true },
          {
            session: session,
          }
        );
      }
    });

    return successRes(res, {
      status: 200,
      message: "Messages fetched successfully.",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const validateJobAndWorker = async (jobId, workerId) => {
  if (!jobId) throw new AppError(400, "Job ID is required.");
  if (!workerId) throw new AppError(400, "Worker ID is required.");

  const [job, worker] = await Promise.all([
    Job.findById(jobId),
    User.findById(workerId),
  ]);

  if (!job) throw new AppError(404, "Job not found.");
  if (!worker) throw new AppError(404, "Worker not found.");
};
