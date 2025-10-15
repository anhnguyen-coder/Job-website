import bcrypt from "bcryptjs";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import { isValidPassword } from "../../../pkg/helper/validation.js";
import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) return AppError(res, 400, "Email is required");

    const user = await User.findOne({
      email: email,
      role: USER_ROLE_ENUM.WORKER,
    });
    if (!user) return AppError(res, 404, "User not found");

    const passwordValid = isValidPassword(password);
    if (!passwordValid)
      return AppError(
        res,
        400,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return successRes(res);
  } catch (error) {
    console.log(error);
    AppError(res, 500, error.message);
  }
};
