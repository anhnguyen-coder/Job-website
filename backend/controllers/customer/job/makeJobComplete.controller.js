import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, Notification, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const makeJobComplete = async (req, res) => {
  try {
    const customerId = req.user.id;
    const jobId = req.params.jobId;
    const workerId = req.body.workerId;

    if (!workerId) return AppError(res, 400, "Worker ID is required");
    if (!jobId) return AppError(res, 400, "Job ID is required");
    if (!customerId) return AppError(res, 401, "Unauthorized");

    const job = await Job.findOne({
      _id: jobId,
      customerId,
      assignedWorkerId: workerId,
    });

    if (!job) return AppError(res, 404, "Job not found");

    if (job.status !== JOB_STATUS.CHECK_COMPLETE) {
      return AppError(res, 400, "Job is not in a state to be completed");
    }

    await withTransaction(async (session) => {
      job.status = JOB_STATUS.COMPLETED;
      await job.save({ session });

      await updateWorkerEarnings(workerId, job.budget || 0, session);
      await notifyWorker(workerId, job.title, session);
    });

    return successRes(res);
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

const updateWorkerEarnings = async (workerId, amount, session) => {
  const worker = await User.findById(workerId).session(session);
  if (!worker) throw new Error("Worker not found");

  worker.totalEarnings = (worker.totalEarnings || 0) + amount;
  await worker.save({ session });

  await notifyWorkerPaymentReceived(workerId, jobTitle, session);
};

const notifyWorker = async (workerId, jobTitle, session) => {
  await Notification.create(
    {
      userId: workerId,
      type: "job_status_changed",
      title: `Job marked complete`,
      content: `Your job: ${jobTitle} has been marked complete by the customer. You will soon receive the payment for your work.`,
    },
    { session: session }
  );
};

const notifyWorkerPaymentReceived = async (workerId, jobTitle, session) => {
  await Notification.create(
    {
      userId: workerId,
      type: "payment_received",
      title: `Payment received for job: ${jobTitle}`,
      content: `You have received payment for the job: ${jobTitle}. Thank you for your work.`,
    },
    { session: session }
  );
};
