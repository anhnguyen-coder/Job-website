import transporter from "../../../config/nodemailer.js";
import { USER_ROLE_ENUM } from "../../../enums/userRole.enum.js";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import {
  isEmailValid,
  isValidPassword,
} from "../../../pkg/helper/validation.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    validateRegisterInput(res, name, email, password);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return AppError(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: USER_ROLE_ENUM.CUSTOMER,
    });

    await user.save();

    //Sending welcome email
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our job application",
      text: `Welcome to our website. Your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOption);

    return successRes(res);
  } catch (error) {
    return AppError(res, 500, error.message);
  }
};

const validateRegisterInput = (res, name, email, password) => {
  if (!name || !email || !password)
    return AppError(res, 400, "Missing details");

  if (name.trim().length < 2)
    return AppError(res, 400, "Name must be at least 2 characters long");

  if (!isEmailValid(email)) return AppError(res, 400, "Invalid email format");

  if (password.trim().length < 8)
    return AppError(res, 400, "Password must be at least 8 characters long");

  if (!isValidPassword(password))
    return AppError(
      res,
      400,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
};
