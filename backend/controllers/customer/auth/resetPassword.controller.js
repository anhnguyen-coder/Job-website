import bcrypt from "bcryptjs";
import { User } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) throw AppError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw AppError(404, "User not found");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return successRes(res);
  } catch (error) {
    console.log(error);
    AppError(500, error.message);
  }
};
