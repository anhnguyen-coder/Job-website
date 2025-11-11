import bcrypt from "bcryptjs";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import jwt from "jsonwebtoken";
import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw AppError(res, 404, "User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw AppError(res, 401, "Invalid password");

    const token = jwt.sign(
      { id: user._id, role: USER_ROLE_ENUM.CUSTOMER },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const isProd = process.env.APP_ENV === "production";

    res.cookie("customerToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successRes(res, { data: token });
  } catch (error) {
    console.log(error);
    AppError(res, 500, error.message);
  }
};
