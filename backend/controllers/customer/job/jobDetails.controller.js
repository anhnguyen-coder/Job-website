import { Job } from "../../../models/index.js";
import AppError from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const jobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng.",
      });
    }

    const job = Job.findOne({ id: jobId, customerId: customerId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại.",
      });
    }

    return successRes(res, { status: 200, data: { job } });
  } catch (error) {
    AppError(500, "Đã xảy ra lỗi khi lấy thông tin công việc.", error.message);
  }
};
