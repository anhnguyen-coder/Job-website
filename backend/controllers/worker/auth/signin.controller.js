import bcrypt from "bcryptjs";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import jwt from "jsonwebtoken";
import successRes from "../../../pkg/helper/successRes.js";
import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return AppError(res, 400, "Missing details");
    }

    const worker = await User.findOne({
      email: email,
      role: USER_ROLE_ENUM.WORKER,
    });
    if (!worker) {
      return AppError(res, 400, "Worker does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      return AppError(res, 400, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: worker._id, role: USER_ROLE_ENUM.WORKER },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("workerToken", token, {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: process.env.APP_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successRes(res, {
      data: token,
    });
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};
