import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const makeJobComplete = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const jobId = req.params.jobId;
    const workerId = req.body.workerId;

    if (!workerId) throw new AppError(400, "Worker ID is required");
    if (!jobId) throw new AppError(400, "Job ID is required");

    const worker = await User.findById({ _id: workerId, role: "worker" });
    if (!worker) throw new AppError(404, "Worker not found");

    const job = await Job.findOne({
      _id: jobId,
      customerId,
      assignedWorkerId: worker._id,
    });

    if (!job) throw new AppError(404, "Job not found");

    if (job.status !== JOB_STATUS.CHECK_COMPLETE) {
      throw new AppError(400, "Job is not in a state to be completed");
    }

    await withTransaction(async (session) => {
      job.status = JOB_STATUS.COMPLETED;
      await job.save({ session });

      worker.totalEarnings = (worker.totalEarnings || 0) + job.budget;
      await worker.save({ session });

      //TODO: Send notification to worker about earnings update
    });

    return successRes(res);
  } catch (error) {
    next(error);
  }
};
