import jwt from "jsonwebtoken";
import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const validateToken = async (req, res) => {
  try {
    const { workerToken } = req.cookies;
    if (!workerToken) {
      return AppError(res, 401, "No token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(workerToken, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        decoded = jwt.decode(workerToken);
        if (!decoded?.id) return AppError(res, 401, "Invalid token payload");

        const user = await User.findById(decoded.id);
        if (!user) return AppError(res, 404, "User not found");

        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const isProd = process.env.APP_ENV === "production";

        res.cookie("workerToken", newToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successRes(res, {
          message: "Token refreshed successfully",
        });
      }

      return AppError(res, 401, "Invalid token");
    }

    return successRes(res, {
      message: "Token is valid",
    });
  } catch (error) {
    console.error(error);
    return AppError(res, 500, "Internal server error");
  }
};
