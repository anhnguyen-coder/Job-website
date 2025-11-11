import { User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const getWorkerByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (name.trim() === "") return successRes(res, { data: [] });

    const worker = await User.find({
      name: { $regex: name, $options: "i" },
    });

    successRes(res, { data: worker });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
