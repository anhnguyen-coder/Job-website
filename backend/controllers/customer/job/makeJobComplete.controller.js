import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, Payment, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const makeJobComplete = async (req, res) => {
  try {
    const customerId = req.user.id;
    const jobId = req.params.jobId;
    const workerId = req.body.workerId;
    const paymentMethod = req.body.paymentMethod;

    if (!workerId) return AppError(res, 400, "Worker ID is required");
    if (!jobId) return AppError(res, 400, "Job ID is required");
    if (!customerId) return AppError(res, 401, "Unauthorized");
    if (!paymentMethod) return AppError(res, 400, "Payment method is required");

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

      await Payment.create(
        [
          {
            jobId,
            workerId,
            customerId,
            amount: job.budget,
            status: "paid",
            paymentMethod,
          },
        ],
        { session }
      );

      await updateWorkerEarnings(workerId, job.budget || 0, session);
    });

    successRes(res);
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

const updateWorkerEarnings = async (workerId, amount, session) => {
  const worker = await User.findById(workerId).session(session);
  if (!worker) throw new Error("Worker not found");

  worker.totalEarnings = (worker.totalEarnings || 0) + amount;
  await worker.save({ session });

  //TODO: Send notification to worker about earnings update
};
