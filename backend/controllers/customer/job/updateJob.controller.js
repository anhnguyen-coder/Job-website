import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Category, Job, JobTask } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, categoryIds, location, budget, tasks } =
      req.body;
    const customerId = req.user.id;

    // 🔹 Kiểm tra job có tồn tại và thuộc về user
    const job = await Job.findOne({ _id: jobId, customerId });
    if (!job) return AppError(res, 404, "Job not found or not owned by you.");

    // 🔹 Không cho update nếu job đang thực hiện
    if (job.status === JOB_STATUS.IN_PROGRESS)
      return AppError(res, 400, "Cannot update a job that is in progress.");

    // 🔹 Validate danh mục & task
    let categoriesArr = [];
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      categoriesArr = await validateCategories(categoryIds);
    }

    const validTasks = await validateTasks(tasks);
    if (validTasks.length === 0) {
      return AppError(res, 400, "Create at least one task for job.");
    }
    if (title)
      // 🔹 Cập nhật các field cơ bản
      job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (budget) job.budget = budget;
    if (categoriesArr.length > 0) job.categories = categoriesArr;

    // 🔹 Transaction an toàn
    await withTransaction(async (session) => {
      const currentTaskIds = job.jobTasks.map((e) => e._id);

      // Xóa task cũ
      await JobTask.deleteMany({ _id: { $in: currentTaskIds } }, { session });

      // Thêm task mới
      const jobTasks = await JobTask.insertMany(
        validTasks.map((t) => ({ ...t, jobId: job._id })),
        { session }
      );

      // Cập nhật job
      job.jobTasks = jobTasks.map((e) => e._id);

      await job.save({ session });
    });

    return successRes(res, { status: 200, data: { job } });
  } catch (error) {
    next(error);
  }
};

/* ----------------------------- HELPERS ---------------------------- */

const validateCategories = async (categoryIds) => {
  const validCategories = await Category.find({ _id: { $in: categoryIds } });
  if (validCategories.length !== categoryIds.length)
    return AppError(res, 400, "One or more categories are invalid.");
  return validCategories.map((c) => c._id);
};

const validateTasks = async (tasks) => {
  if (!Array.isArray(tasks)) return [];
  const validTasks = tasks.filter(
    (t) => t.title && t.description && t.title.trim() && t.description.trim()
  );
  if (validTasks.length !== tasks.length)
    return AppError(res, 400, "One or more tasks are invalid.");
  return validTasks;
};
