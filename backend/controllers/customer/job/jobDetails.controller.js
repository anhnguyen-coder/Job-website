import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    const customerId = req.user?.id;
    if (!customerId) {
      return AppError(res, 401, "Không xác thực được người dùng.");
    }

    const job = await Job.findOne({
      _id: jobId,
      customerId: customerId,
    }).populate("assignedWorkerId", "name email role");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại.",
      });
    }

    return successRes(res, { data: job });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
