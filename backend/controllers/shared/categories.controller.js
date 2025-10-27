import { Category } from "../../models/index.js";
import { AppError } from "../../pkg/helper/errorHandler.js";
import successRes from "../../pkg/helper/successRes.js";

export const getJobCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      throw new AppError("No categories found.", 404);
    }

    return successRes(res, { data: categories });
  } catch (error) {
    next(error);
  }
};
