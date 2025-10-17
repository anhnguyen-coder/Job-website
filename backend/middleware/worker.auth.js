import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const workerAuth = async (req, res, next) => {
  const { workerToken } = req.cookies;

  if (!workerToken) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please try again",
    });
  }

  try {
    const tokenDecode = jwt.verify(workerToken, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      const user = await User.findById(tokenDecode.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please try again",
        });
      }

      if (user.role !== "worker")
        return res.status(403).json({
          success: false,
          message: "Access denied. worker only",
        });

      if (!user.active) {
        return res.status(403).json({
          success: false,
          message: "Account not active. Please contact support",
        });
      }
      req.user = { id: tokenDecode.id };
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please try again",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default workerAuth;
