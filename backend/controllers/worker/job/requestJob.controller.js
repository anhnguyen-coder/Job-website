import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { getIO, getOnlineUsers } from "../../../socket/index.js";

export const requestJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return AppError(res, 404, "Job not found");
    }

    if (job.status !== JOB_STATUS.AVAILABLE) {
      return AppError(res, 400, "Job is not available for request");
    }

    const hasRequested = await JobRequest.findOne({
      jobId: jobId,
      workerId: workerId,
    });

    if (hasRequested)
      return AppError(res, 400, "You can only apply once for this job.");

    await withTransaction(async (session) => {
      const jobRequest = new JobRequest({
        jobId: job._id,
        workerId: workerId,
        customerId: job.customerId,
        status: JOB_REQUEST_STATUS.PENDING,
      });

      await jobRequest.save();

      await jobRequest.populate("workerId", "name");
      // create noti
      const notification = await Notification.create(
        [
          {
            userId: job.customerId,
            type: "info",
            title: "Job Application Request",
            content: `Received one job application request for your job: ${job.title}. \n Worker: ${jobRequest.workerId.name}`,
          },
        ],
        { session: session }
      );

      const io = getIO();
      if (io) {
        sendReceiveNotificationToUser(job.customerId, io, notification[0]);
      }
    });

    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    AppError(res, 500, error.message);
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
