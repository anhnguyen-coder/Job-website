import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { getIO, getOnlineUsers } from "../../../socket/index.js";

const STATUS_ALLOW_CANCEL = new Set([JOB_STATUS.AVAILABLE, JOB_STATUS.TAKEN]);

export const updateJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;
    const { status } = req.body;

    if (
      ![
        JOB_STATUS.IN_PROGRESS,
        JOB_STATUS.CHECK_COMPLETE,
        JOB_STATUS.CANCELLED,
      ].includes(status)
    ) {
      return AppError(res, 400, "Invalid status update");
    }

    const [job, jobRequest] = await Promise.all([
      Job.findOne({ _id: jobId, assignedWorkerId: workerId }),
      JobRequest.findOne({ jobId, workerId }),
    ]);

    if (!job) return AppError(res, 404, "Job not found");
    if (!jobRequest)
      return AppError(res, 403, "You are not assigned to this job");
    if (jobRequest.status !== JOB_REQUEST_STATUS.ACCEPTED)
      return AppError(res, 403, "You are not approved for this job");

    const updatedJob = await withTransaction(async (session) => {
      switch (status) {
        case JOB_STATUS.CANCELLED:
          await handleCancelJob(job, session);
          break;

        case JOB_STATUS.CHECK_COMPLETE:
          await handleCompleteJob(job, session);
          break;
        case JOB_STATUS.IN_PROGRESS:
          await handleStartJob(job, session);
          break;
      }
      return job;
    });

    return successRes(res, { data: updatedJob, status: 200 });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

/* -------------------- HANDLERS -------------------- */

const handleCancelJob = async (job, workerId, session) => {
  if (!STATUS_ALLOW_CANCEL.has(job.status)) {
    throw new Error("Cannot cancel job after it has started");
  }

  job.status = JOB_STATUS.CANCELLED;
  job.assignedWorkerId = null;
  await job.save({ session });
  await JobRequest.findOneAndUpdate(
    { jobId: job._id, workerId: workerId },
    {
      status: JOB_REQUEST_STATUS.REJECTED,
    },
    { new: true, session: session }
  );

  const notification = await Notification.create(
    [
      {
        userId: job.customerId,
        type: "error",
        title: "Job canceled",
        content: `Your job: ${job.title} has been cancelled by worker.`,
      },
    ],
    { session: session }
  );

  const io = getIO();
  if (io) {
    sendReceiveNotificationToUser(job.customerId, io, notification[0]);
  }
};

const handleCompleteJob = async (job, session) => {
  if (job.status !== JOB_STATUS.IN_PROGRESS) {
    throw new Error("Cannot complete job before starting");
  }

  job.status = JOB_STATUS.CHECK_COMPLETE;
  await job.save({ session });

  const notification = await Notification.create(
    [
      {
        userId: job.customerId,
        type: "info",
        title: "Job check complete",
        content: `All tasks in your job: ${job.title} is completed and now worker is requesting for checking complete`,
      },
    ],
    { session: session }
  );

  const io = getIO();
  if (io) {
    sendReceiveNotificationToUser(job.customerId, io, notification[0]);
  }
};

const handleStartJob = async (job, session) => {
  if (job.status === JOB_STATUS.AVAILABLE && !job.assignedWorkerId) {
    throw new Error("You are not assigned to this job");
  }

  if (job.assignedWorkerId && job.status !== JOB_STATUS.TAKEN) {
    throw new Error("This job has akready started!");
  }

  job.status = JOB_STATUS.IN_PROGRESS;
  await job.save({ session });

  const notification = await Notification.create(
    [
      {
        userId: job.customerId,
        type: "info",
        title: "Job Started",
        content: `Your job: ${job.title} now is started by worker.`,
      },
    ],
    { session: session }
  );

  const io = getIO();
  if (io) {
    sendReceiveNotificationToUser(job.customerId, io, notification[0]);
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
