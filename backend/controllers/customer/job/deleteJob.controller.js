import { Job } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      throw AppError(res, 401, "Không xác thực được người dùng.");
    }

    const job = await Job.findOne({ _id: jobId, customerId });

    if (!job) {
      throw AppError(
        res,
        404,
        "Công việc không tồn tại hoặc không thuộc về bạn."
      );
    }

    if (job && job.status === "in_progress") {
      return AppError(res, 400, "Không thể xóa công việc đang tiến hành.");
    }

    await Job.deleteOne({ _id: jobId, customerId });

    return successRes(res, { status: 200, data: null });
  } catch (error) {
    next(error);
  }
};
