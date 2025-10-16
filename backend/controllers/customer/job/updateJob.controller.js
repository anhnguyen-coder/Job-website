import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, categoryIds, location, budget } = req.body;
    const customerId = req.user?.id;

    if (!customerId) {
      throw new AppError(401, "Không xác thực được người dùng.");
    }

    const job = await Job.findOne({ _id: jobId, customerId });

    if (!job) {
      throw new AppError(
        404,
        "Công việc không tồn tại hoặc không thuộc về bạn."
      );
    }

    if (job && job.status === JOB_STATUS.IN_PROGRESS) {
      return AppError(res, 400, "Không thể cập nhật công việc đang tiến hành.");
    }

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      await validateCategories(categoryIds);
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (budget) job.budget = budget;

    await job.save();

    return successRes(res, { status: 200, data: { job } });
  } catch (error) {
    next(error);
  }
};

const validateCategories = async (categoryIds) => {
  try {
    categoryIds.forEach(async (element) => {
      const isValid = await Category.findById(element);
      if (!isValid) {
        throw new AppError(400, "Danh mục không hợp lệ.");
      }
    });
  } catch (error) {
    throw error;
  }
};
