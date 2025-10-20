import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const findByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({
      email: email,
      role: USER_ROLE_ENUM.CUSTOMER,
    }).select("-password");

    if (!user) return AppError(res, 404, "User not found");

    return successRes(res, { data: user });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
