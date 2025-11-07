import { Bookmark, Job, JobTask } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateJobTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const jobTask = await JobTask.findById(taskId);
    if (!jobTask) return AppError(res, "Task not found", 404);

    jobTask.isCompleted = !jobTask.isCompleted;

    await jobTask.save();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
