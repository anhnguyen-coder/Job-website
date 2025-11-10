import { Job, Rating, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const makeRateCustomer = async (req, res) => {
  try {
    const { targetType, targetId, jobId, rating, comment } = req.body;

    const authorId = req.user.id;

    validateRequest(targetType, targetId, jobId, res);

    const isExist = await Rating.findOne({
      authorType: "worker",
      authorId: authorId,
      targetType: targetType,
      targetId: targetId,
      jobId: jobId,
    });

    if (isExist) {
      isExist.rating = rating;
      isExist.comment = comment;
      await isExist.save();
      return successRes(res);
    }

    await Rating.create({
      authorType: "worker",
      authorId: authorId,
      targetType: targetType,
      targetId: targetId,
      jobId: jobId,
      rating: rating,
      comment: comment,
    });

    successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validateRequest = (targetType, targetId, jobId, res) => {
  if (targetType.trim() !== "customer") {
    return AppError(res, 400, "Invalid targetType");
  }

  if (targetId.trim().length === 0) {
    return AppError(res, 400, "Invalid targetId");
  }

  if (jobId.trim().length === 0) {
    return AppError(res, 400, "Invalid jobId");
  }

  validateTargetId(targetType, targetId, res);
  validateJobId(jobId, res);
};

const validateTargetId = async (targetType, targetId, res) => {
  const target = await User.findOne({ _id: targetId, role: targetType });

  if (!target) {
    return AppError(res, 404, "Target user not found");
  }
};

const validateJobId = async (jobId, res) => {
  const job = await Job.findById(jobId);

  if (!job) {
    return AppError(res, 404, "Job not found");
  }
};
