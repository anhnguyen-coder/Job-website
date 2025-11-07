import { Bookmark, Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const bookmarkJob = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return AppError(res, 404, "Job not found");
    }

    const existingBookmark = await Bookmark.findOne({ workerId, jobId });
    if (existingBookmark) {
      return AppError(res, 400, "Job already saved to Bookmark");
    }

    const newBookmark = new Bookmark({ workerId, jobId });
    await newBookmark.save();

    return successRes(res, { data: newBookmark, status: 200 });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
