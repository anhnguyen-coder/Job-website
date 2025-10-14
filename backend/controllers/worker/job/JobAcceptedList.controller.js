import { Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobListaccepted = async (req, res, next) => {
  try {
    const workerId = req.user.id;

    const jobs = await Job.find({
      assignedWorkerId: workerId,
      status: "job_accepted",
    });

    return successRes(res, { data: jobs, status: 200 });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
