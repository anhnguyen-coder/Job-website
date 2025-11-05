import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await User.findById(userId);

    if (!profile) return AppError(res, "User not found", 404);

    successRes(res, { data: profile });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
