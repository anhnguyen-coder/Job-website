import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, Category } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, categoryIds, location, budget } = req.body;
    const customerId = req.user?.id;

    if (!customerId) {
      throw new AppError(401, "User authentication failed.");
    }

    const job = await Job.findOne({ _id: jobId, customerId });

    if (!job) {
      throw new AppError(404, "Job not found or does not belong to you.");
    }

    if (job.status === JOB_STATUS.IN_PROGRESS) {
      throw new AppError(400, "Cannot update a job that is in progress.");
    }

    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await validateCategories(categoryIds);
      job.categories = categoryIds;
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
  const results = await Promise.all(
    categoryIds.map((id) => Category.findById(id))
  );

  const invalid = results.some((cat) => !cat);
  if (invalid) {
    throw new AppError(400, "One or more category IDs are invalid.");
  }
};
