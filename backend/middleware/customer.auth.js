import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const customerAuth = async (req, res, next) => {
  const { customerToken } = req.cookies;

  if (!customerToken) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please try again",
    });
  }

  try {
    const tokenDecode = jwt.verify(customerToken, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      const user = await User.findById(tokenDecode.id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid token. Please try again",
        });
      }

      if (user.role !== "customer")
        return res.status(403).json({
          success: false,
          message: "Access denied. Customers only",
        });

      if (!user.active) {
        return res.status(403).json({
          success: false,
          message: "Account not active. Please contact support",
        });
      }

      req.user = { id: tokenDecode.id };
    } else {
      return res.status(400).json({
        success: false,
        message: "Not authorized. Please try again",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default customerAuth;
