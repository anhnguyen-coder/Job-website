import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const listJobs = async (req, res) => {
  try {
    const { title, category, location, minBudget, maxBudget } = req.query;

    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (category) {
      const categories = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      filter.categories = { $in: categories };
    }
    if (location) filter.location = { $regex: location, $options: "i" };

    filter.status = JOB_STATUS.AVAILABLE;

    // budget range
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    // pagination
    const { page, limit, skip } = getPagination(req.query);

    const [jobs, total] = await Promise.all([
      Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("categories", "name").lean(),
      Job.countDocuments(filter),
    ]);

    const pagy = getPagingData(total, page, limit);

    return successRes(res, {
      status: 200,
      data: jobs,
      pagy,
    });
  } catch (error) {
    return AppError(res, 500, error.message || "Server Error");
  }
};
