import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";
import { User } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const findByEmail = async (req, res) => {
  try {
    const { email } = req.query.email;
    const user = await User.find({
      email: email,
      role: USER_ROLE_ENUM.CUSTOMER,
    });

    if (!user) throw AppError(404, "User not found");

    return successRes(res, { data: user });
  } catch (error) {
    AppError(500, error.message);
  }
};
