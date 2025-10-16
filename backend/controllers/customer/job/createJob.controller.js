import mongoose from "mongoose";
import { Category, Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const createJob = async (req, res, next) => {
  try {
    const { title, description, categoryIds, location, budget } = req.body;
    const customerId = req.user?.id;

    if (!title || !description || !categoryIds || !location || !budget) {
      throw AppError(res, 400, "Vui lòng nhập đầy đủ thông tin.");
    }

    if (!customerId) {
      throw AppError(res, 401, "Không xác thực được người dùng.");
    }

    const categoriesArr = await validateCategories(categoryIds, res);

    console.log(categoriesArr);

    const job = await Job.create({
      title,
      description,
      categories: categoriesArr,
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

const validateCategories = async (categoryIds, res) => {
  try {
    if (typeof categoryIds !== "string")
      throw AppError(res, 400, "Danh mục không hợp lệ.");

    const ids = categoryIds.split(",").map((id) => id.trim());

    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw AppError(res, 400, `ID danh mục không hợp lệ: ${id}`);
      }

      // const isValid = await Category.findById(id);
      // if (!isValid) {
      //   throw AppError(res, 400, `Không tìm thấy danh mục với ID: ${id}`);
      // }
    }

    return ids.map((id) => new mongoose.Types.ObjectId(id));
  } catch (error) {
    throw error;
  }
};
