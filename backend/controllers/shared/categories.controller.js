import { Category } from "../../models/index.js";
import { AppError } from "../../pkg/helper/errorHandler.js";
import successRes from "../../pkg/helper/successRes.js";

export const getJobCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return successRes(res, { data: categories });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
