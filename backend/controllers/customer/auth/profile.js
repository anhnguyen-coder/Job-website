import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const profile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const user = await User.findById(customerId).select("-password");
    return successRes(res, { data: user });
  } catch (error) {
    console.log(error);
    AppError(res, 500, error.message);
  }
};
