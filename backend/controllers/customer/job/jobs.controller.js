import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobs = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const filter = { customerId };

    if (req.query.status) {
      const statuses = req.query.status
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (statuses.length > 0) {
        filter.status = { $in: statuses };
      }
    }

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const budget = Number(req.query.budget);
    if (!isNaN(budget)) {
      filter.budget = { $gte: budget };
    }

    if (req.query.location) {
      filter.location = req.query.location;
    }

    if (req.query.category) {
      const categories = req.query.category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      filter.categories = { $in: categories };
    }

    const { page, limit, skip } = getPagination(req.query);

    const [jobList, total] = await Promise.all([
      Job.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("jobTasks")
        .populate("categories"),
      Job.countDocuments(filter),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, {
      data: jobList,
      pagy: pagination,
      status: 200,
    });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};
