import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest } from "../../../models/index.js";
import JobTicket from "../../../models/jobTicket.model.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

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

        default:
          job.status = status;
          await job.save({ session });
          break;
      }
      return job;
    });

    return successRes(res, { data: updatedJob, status: 200 });
  } catch (error) {
    next(error);
    return AppError(res, 500, error.message);
  }
};

/* -------------------- HANDLERS -------------------- */


const handleCancelJob = async (job, session) => {
  if (!STATUS_ALLOW_CANCEL.has(job.status)) {
    throw new Error("Cannot cancel job after it has started");
  }

  job.status = JOB_STATUS.CANCELLED;
  job.assignedWorkerId = null;
  await job.save({ session });

  await JobTicket.create(
    [
      {
        jobId: job._id,
        workerId: job.assignedWorkerId,
        customerId: job.customerId,
        ticketType: "issue",
        message: "Job cancelled by worker",
      },
    ],
    { session }
  );
};

const handleCompleteJob = async (job, session) => {
  if (job.status !== JOB_STATUS.IN_PROGRESS) {
    throw new Error("Cannot complete job before starting");
  }

  job.status = JOB_STATUS.CHECK_COMPLETE;
  await job.save({ session });

  await JobTicket.create(
    [
      {
        jobId: job._id,
        workerId: job.assignedWorkerId,
        customerId: job.customerId,
        ticketType: "feedback",
        message: "Job completed by worker, pending customer review",
      },
    ],
    { session }
  );
};
