import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const customerAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized. Please try again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      const user = await User.findById(tokenDecode.id);
      if (!user) {
        return res.json({
          success: false,
          message: "Invalid token. Please try again",
        });
      }

      if (user.role !== "customer")
        return res.json({
          success: false,
          message: "Access denied. Customers only",
        });

      req.user = { id: tokenDecode.id };
    } else {
      return res.json({
        success: false,
        message: "Not authorized. Please try again",
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default customerAuth;
