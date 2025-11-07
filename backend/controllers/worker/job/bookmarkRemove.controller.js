import { Bookmark, Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const bookmarkJobRemove = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Bookmark.findOne({ jobId: jobId, workerId: workerId });
    if (!job) {
      return AppError(res, 404, "Job not found");
    }

    await job.deleteOne();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
