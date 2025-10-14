import { Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobApproval = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const customerId = req.user.id;

    const job = await Job.find({ id: jobId, customerId: customerId });

    if (!job) {
      AppError(404, "Job not found");
    }

    job.status = "job_accepted";
    await job.save();

    return successRes(res, { data: job, status: 200 });
  } catch (error) {}
};
