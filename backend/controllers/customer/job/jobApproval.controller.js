import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { getIO, getOnlineUsers } from "../../../socket/index.js";

export const jobApproval = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { status, workerId } = req.body;
    const customerId = req.user.id;

    if (!status || !Object.values(JOB_REQUEST_STATUS).includes(status)) {
      return AppError(res, 400, "Invalid status");
    }

    if (!workerId) {
      return AppError(res, 400, "Worker ID is required");
    }

    if (!customerId) {
      return AppError(res, 401, "Unauthorized");
    }

    await withTransaction(async (session) => {
      const jobRequest = await JobRequest.findOne({
        jobId: jobId,
        workerId: workerId,
        customerId: customerId,
        status: JOB_REQUEST_STATUS.PENDING,
      }).session(session);

      if (!jobRequest) {
        return AppError(res, 404, "Job request not found");
      }

      const job = await Job.findOne({
        _id: jobId,
        customerId: customerId,
      }).session(session);

      if (!job) {
        return AppError(res, 404, "Job not found");
      }

      if (status === JOB_REQUEST_STATUS.ACCEPTED) {
        jobRequest.status = JOB_REQUEST_STATUS.ACCEPTED;
        job.status = JOB_STATUS.TAKEN;
        job.assignedWorkerId = workerId;

        // reject all other pending job requests for the same job
        await bulkRejectJobRequests(jobRequest.jobId, workerId, session);
        // TODO: handle notification to worker about job acceptance

        const notification = await Notification.create(
          [
            {
              userId: workerId,
              type: "success",
              title: "Job Request Approval",
              content: `Your job application request for job: ${job.title} has been accepted by customer.`,
            },
          ],
          {
            session: session,
          }
        );

        const io = getIO();
        if (io) {
          sendReceiveNotificationToUser(workerId, io, notification[0]);
        }
      }
      if (status === JOB_REQUEST_STATUS.REJECTED) {
        jobRequest.status = JOB_REQUEST_STATUS.REJECTED;
        job.status = JOB_STATUS.AVAILABLE;

        // TODO: handle notification to worker about job rejection
        const notification = await Notification.create(
          [
            {
              userId: workerId,
              type: "success",
              title: "Job Request Rejected",
              content: `Your job application request for job: ${job.title} has been rejected by customer.`,
            },
          ],
          {
            session: session,
          }
        );

        const io = getIO();
        if (io) {
          sendReceiveNotificationToUser(workerId, io, notification[0]);
        }
      }

      await jobRequest.save();
      await job.save();
    });

    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

// TODO: create notification for worker when job request is accepted or rejected

const bulkRejectJobRequests = async (jobId, workerId, session) => {
  await JobRequest.updateMany(
    {
      jobId: jobId,
      status: JOB_REQUEST_STATUS.PENDING,
      workerId: { $ne: workerId },
    },
    { $set: { status: JOB_REQUEST_STATUS.REJECTED } }
  ).session(session);
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
