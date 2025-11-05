import bcrypt from "bcryptjs";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";
import successRes from "../../../pkg/helper/successRes.js";
import {
  isEmailValid,
  isValidPassword,
} from "../../../pkg/helper/validation.js";

export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    validateRegisterInput(res, name, email, password, confirmPassword);

    const existingWorker = await User.findOne({ email: email });
    if (existingWorker) {
      return AppError(res, 400, "Worker already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: USER_ROLE_ENUM.WORKER,
    });

    await worker.save();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validateRegisterInput = (res, name, email, password, confirmPassword) => {
  if (!name || !email || !password)
    return AppError(res, 400, "Missing details");

  if (name.trim().length < 2)
    return AppError(res, 400, "Name must be at least 2 characters long");

  if (!isEmailValid(email)) return AppError(res, 400, "Invalid email format");

  if (password.trim().length < 8)
    return AppError(res, 400, "Password must be at least 8 characters long");

  if (password !== confirmPassword)
    return AppError(res, 400, "Passwords do not match");

  if (!isValidPassword(password))
    return AppError(
      res,
      400,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
};
