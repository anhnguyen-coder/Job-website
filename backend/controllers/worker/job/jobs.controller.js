import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const listJobs = async (req, res, next) => {
  try {
    // queries for filtering
    const title = req.query.title;
    const customerid = req.query.customerid;
    const categories = req.query.categories;
    const location = req.query.location;
    const status = req.query.status;
    const minBudget = req.query.minBudget;
    const maxBudget = req.query.maxBudget;

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive regex search
    }
    if (customerid) {
      filter.customerId = customerid;
    }
    if (categories) {
      filter.categories = { $in: categories.split(",") };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive regex search
    }
    if (status) {
      filter.status = status;
    }
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) {
        filter.budget.$gte = Number(minBudget);
      }
      if (maxBudget) {
        filter.budget.$lte = Number(maxBudget);
      }
    }

    filter.status = "available";

    // pagination

    const { page, limit, skip } = getPagination(req.query);
    const [jobs, total] = await Promise.all([
      Job.find(filter).skip(skip).limit(limit),
      Job.countDocuments(),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, {
      status: 200,
      data: jobs,
      pagy: pagination,
    });
  } catch (error) {
    AppError(500, "Server Error");
  }
};
