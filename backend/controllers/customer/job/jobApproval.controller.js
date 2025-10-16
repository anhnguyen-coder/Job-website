import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

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
      }
      if (status === JOB_REQUEST_STATUS.REJECTED) {
        jobRequest.status = JOB_REQUEST_STATUS.REJECTED;
        job.status = JOB_STATUS.AVAILABLE;

        // TODO: handle notification to worker about job rejection
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
