import mongoose from "mongoose";
import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobs = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      throw new AppError(401, "Unauthorized: Missing customer ID");
    }

    const {
      status,
      title,
      budgetMin,
      budgetMax,
      location,
      category,
      page,
      limit,
    } = req.query;

    // ===== Build Filter =====
    const filter = { customerId };

    if (status) {
      if (Array.isArray(status)) {
        if (status.length > 0) filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }

    if (title && typeof title === "string") {
      filter.title = { $regex: title, $options: "i" };
    }

    if (budgetMin) {
      console.log(budgetMin);
      filter.budget = { ...filter.budget, $gte: Number(budgetMin) };
    }

    if (budgetMax) {
      console.log(budgetMax);
      filter.budget = { ...filter.budget, $lte: Number(budgetMax) };
    }

    if (location && typeof location === "string") {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category) {
      if (Array.isArray(category)) {
        filter.categories = {
          $in: category.map((id) =>
            mongoose.Types.ObjectId.createFromHexString(String(id))
          ),
        };
      } else {
        filter.categories = [
          mongoose.Types.ObjectId.createFromHexString(String(category)),
        ];
      }
    }

    // ===== Pagination =====
    const pageQuery = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    const {
      page: currentPage,
      limit: perPage,
      skip,
    } = getPagination(pageQuery);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .populate("jobTasks")
        .lean(),
      Job.countDocuments(filter),
    ]);

    const pagination = getPagingData(total, currentPage, perPage);

    // ===== Response =====
    return successRes(res, {
      data: jobs,
      pagy: pagination,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
