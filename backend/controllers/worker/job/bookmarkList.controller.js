import { Bookmark } from "../../../models/index.js";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const bookmarkList = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const { title, minBudget, maxBudget, categories } = req.query;

    const { page, limit, skip } = getPagination(req.query);

    const jobFilter = {};
    if (title) jobFilter.title = { $regex: title, $options: "i" };

    if (categories) {
      const categoriesArr = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      jobFilter.categories = { $in: categoriesArr };
    }

    if (minBudget || maxBudget) {
      jobFilter.budget = {};
      if (minBudget) jobFilter.budget.$gte = Number(minBudget);
      if (maxBudget) jobFilter.budget.$lte = Number(maxBudget);
    }

    const bookmarks = await Bookmark.find({ workerId }).select("jobId");

    const jobIds = bookmarks.map((b) => b.jobId);

    const [jobs, total] = await Promise.all([
      Job.find({ _id: { $in: jobIds }, ...jobFilter })
        .populate([
          { path: "customerId", select: "name email" },
          { path: "categories", select: "name" },
          { path: "jobTasks", select: "title description" },
        ])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Job.countDocuments({ _id: { $in: jobIds }, ...jobFilter }),
    ]);

    const pagy = getPagingData(total, page, limit);

    return successRes(res, {
      data: jobs,
      status: 200,
      pagy,
    });
  } catch (error) {
    console.error("Error in bookmarkList:", error);
    next(error);
    AppError(500, "Server Error");
  }
};
