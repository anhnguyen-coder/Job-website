import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const updateJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      JOB_STATUS.IN_PROGRESS,
      JOB_STATUS.CHECK_COMPLETE,
      JOB_STATUS.CANCELLED,
    ];
    if (!allowedStatuses.includes(status)) {
      return AppError(res, 400, "Invalid status update");
    }

    const [job, jobRequest] = await Promise.all([
      Job.findOne({ _id: jobId, assignedWorkerId: workerId }),
      JobRequest.findOne({ jobId, workerId }),
    ]);

    if (!job) return AppError(res, 404, "Job not found");
    if (!jobRequest)
      return AppError(res, 403, "You are not assigned to this job");
    if (jobRequest.status !== JOB_REQUEST_STATUS.ACCEPTED) {
      return AppError(res, 403, "You are not approved for this job");
    }

    const updatedJob = await withTransaction(async (session) => {
      switch (status) {
        case JOB_STATUS.IN_PROGRESS:
          await markJobInProgress(job, session);
          break;

        case JOB_STATUS.CHECK_COMPLETE:
          await markJobCheckComplete(job, session);
          break;

        case JOB_STATUS.CANCELLED:
          await cancelJob(job, jobRequest, session);
          break;
      }

      await notifyCustomerAboutJobStatusChanged(
        job.customerId,
        job.title,
        job.status,
        session
      );

      return job;
    });

    return successRes(res, { data: updatedJob });
  } catch (error) {
    next(error);
    return AppError(res, 500, error.message);
  }
};

//
// ========================== HANDLERS ==========================
//

const markJobInProgress = async (job, session) => {
  if (job.status !== JOB_STATUS.TAKEN) {
    throw new Error("You can only start jobs that are in 'taken' status.");
  }
  job.status = JOB_STATUS.IN_PROGRESS;
  await job.save({ session });
};

const markJobCheckComplete = async (job, session) => {
  if (job.status !== JOB_STATUS.IN_PROGRESS) {
    throw new Error("You can only mark as complete after work has started.");
  }
  job.status = JOB_STATUS.CHECK_COMPLETE;
  await job.save({ session });
};

const cancelJob = async (job, jobRequest, session) => {
  if (job.status !== JOB_STATUS.TAKEN) {
    throw new Error("You cannot cancel this job after started");
  }

  job.status = JOB_STATUS.CANCELLED;
  job.assignedWorkerId = null;
  await Promise.all([
    job.save({ session }),
    JobRequest.updateOne(
      { _id: jobRequest._id },
      { status: JOB_REQUEST_STATUS.CANCELLED },
      { session }
    ),
  ]);
};

//
// ========================== NOTIFICATION ==========================
//

const buildNotificationContent = (jobTitle, status) => {
  switch (status) {
    case JOB_STATUS.CANCELLED:
      return `Your job "${jobTitle}" has been cancelled by the worker.`;
    case JOB_STATUS.CHECK_COMPLETE:
      return `Your job "${jobTitle}" has been marked as complete by the worker. Please review and confirm if everything looks good.`;
    case JOB_STATUS.IN_PROGRESS:
      return `The worker has started working on your job "${jobTitle}".`;
    default:
      return `Your job "${jobTitle}" status has been updated to ${status}.`;
  }
};

const notifyCustomerAboutJobStatusChanged = async (
  customerId,
  jobTitle,
  status,
  session
) => {
  await Notification.create(
    {
      userId: customerId,
      type: "job_status_update",
      title: `Job status updated: ${jobTitle}`,
      content: buildNotificationContent(jobTitle, status),
    },
    { session }
  );
};
