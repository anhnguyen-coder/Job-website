import mongoose from "mongoose";
import { Category, Job, JobTask } from "../../../models/index.js";

import successRes from "../../../pkg/helper/successRes.js";
import { withTransaction } from "../../../pkg/transaction/transaction.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categoryIds,
      location,
      budget,
      tasks,
      dateStart,
      dateEnd,
    } = req.body;

    const customerId = req.user?.id;

    if (
      !title ||
      !description ||
      !location ||
      !budget ||
      !dateStart ||
      !dateEnd
    ) {
      throw new AppError("Please provide all required fields.", 400);
    }

    const categoriesArr = await validateCategories(categoryIds);
    if (!categoriesArr) throw new AppError("Invalid categories provided.", 400);

    if (!validateTasks(tasks))
      throw new AppError("Invalid tasks provided.", 400);

    const parsedDates = validateDateTimeAndParse(dateStart, dateEnd);
    if (!parsedDates)
      throw new AppError("Invalid or inconsistent date range.", 400);

    const { startDateObj, endDateObj } = parsedDates;

    let job;
    await withTransaction(async (session) => {
      const jobTasks = await JobTask.insertMany(
        tasks.map((t) => ({
          title: t.title,
          description: t.description,
        })),
        { session }
      );

      const createdJobs = await Job.create(
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
            dateStart: startDateObj,
            dateEnd: endDateObj,
          },
        ],
        { session }
      );

      job = createdJobs[0];
    });

    return successRes(res, { data: { job }, status: 200 });
  } catch (error) {
    next(error);
  }
};

//
// --- Helpers ---
//
const validateCategories = async (categoryIds) => {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) return null;
  for (const id of categoryIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const exists = await Category.findById(id);
    if (!exists) return null;
  }
  return categoryIds;
};

const validateTasks = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) return false;
  return tasks.every((t) => t.title && t.description);
};

const validateDateTimeAndParse = (startDate, endDate) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) return null;

  const now = new Date();
  if (startDateObj < now.setHours(0, 0, 0, 0)) return null;
  if (endDateObj < startDateObj) return null;

  startDateObj.setHours(0, 0, 0, 0);
  endDateObj.setHours(23, 59, 59, 999);

  return { startDateObj, endDateObj };
};
