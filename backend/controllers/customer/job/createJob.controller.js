import { Category, Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const createJob = async (req, res, next) => {
  try {
    const { title, description, categoryIds, location, budget } = req.body;
    const customerId = req.user?.id;

    if (
      !title ||
      !description ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0 ||
      !location ||
      !budget
    ) {
      throw new AppError(400, "Vui lòng nhập đầy đủ thông tin.");
    }

    if (!customerId) {
      throw new AppError(401, "Không xác thực được người dùng.");
    }

    await validateCategories(categoryIds);

    const job = await Job.create({
      title,
      description,
      categories: categoryIds,
      location,
      customerId,
      budget,
      status: "available",
    });

    return successRes(res, {
      data: { job },
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const validateCategories = async (categoryIds) => {
  try {
    categoryIds.forEach(async (element) => {
      const isValid = await Category.findById(element);
      if (!isValid) {
        throw new AppError(400, "Danh mục không hợp lệ.");
      }
    });
  } catch (error) {
    throw error;
  }
};
