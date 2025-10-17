import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Notification } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

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

    await withTransaction(async (session) => {
      const jobRequest = new JobRequest({
        jobId: job._id,
        workerId: workerId,
        customerId: job.customerId,
        status: JOB_REQUEST_STATUS.PENDING,
      });

      await jobRequest.save({ session });

      // Notify customer about job request

      await notifyCustomer(job.customerId, job.workerName, job.title, session);
    });

    return successRes(res, { data: null, status: 200 });
  } catch (error) {
    AppError(500, "Server Error");
  }
};

// TODO: Add redirect url
const notifyCustomer = async (customerId, workerName, jobtitle, session) => {
  await Notification.create(
    {
      userId: customerId,
      type: "job_requested",
      title: "Job Requested",
      content: `You have a new job request from ${workerName} about job: ${jobtitle}`,
    },
    {
      session: session,
    }
  );
};
