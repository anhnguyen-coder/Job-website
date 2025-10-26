import mongoose from "mongoose";
import { Category, Job, JobTask } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";

export const createJob = async (req, res, next) => {
  try {
    const { title, description, categoryIds, location, budget, tasks } =
      req.body;
    const customerId = req.user?.id;

    if (!title || !description || !location || !budget) {
      return AppError(res, 400, "Please provide all required fields.");
    }

    if (!customerId) {
      return AppError(res, 401, "User authentication failed.");
    }

    const categoriesArr = await validateCategories(categoryIds, res);
    if (!categoriesArr) return;

    const isValidTasks = validateTasks(tasks);
    if (!isValidTasks) return AppError(res, 400, "Invalid tasks");

    let job;

    await withTransaction(async (session) => {
      const jobTasks = await JobTask.insertMany(
        tasks.map((t) => ({
          title: t.title,
          description: t.description,
        })),
        { session }
      );

      job = await Job.create(
        [
          {
            title,
            description,
            categories: categoriesArr,
            jobTasks: jobTasks.map((t) => t._id),
            location,
            customerId,
            budget,
            status: "available",
          },
        ],
        { session }
      );
    });

    return successRes(res, {
      data: { job: job[0] },
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// --- Validate category IDs ---
const validateCategories = async (categoryIds, res) => {
  if (!Array.isArray(categoryIds)) {
    return AppError(res, 400, "Invalid categories format.");
  }

  

  for (const id of categoryIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return AppError(res, 400, `Invalid category ID: ${id}`);
    }

    const exists = await Category.findById(id);
    if (!exists) {
      return AppError(res, 400, `Category not found with ID: ${id}`);
    }
  }

  return categoryIds
};

// --- Validate tasks ---
const validateTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    return false;
  }

  for (const task of tasks) {
    if (!task.title || !task.description) {
      return false;
    }
  }

  return true;
};
