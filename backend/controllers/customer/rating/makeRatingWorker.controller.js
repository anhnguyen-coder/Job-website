import { Job, Rating, User } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const makeRatingWorker = async (req, res, next) => {
  const { workerId, jobId, rating, comment } = req.body;
  const customerId = req.user.id;
  try {
    await validateRatingInput(workerId, jobId, rating, comment);

    const rate = Rating.create({
      authorId: customerId,
      authorType: "customer",
      targetId: workerId,
      targetType: "worker",
      jobId: jobId,
      rating: rating,
      comment: comment,
    });

    await rate.save();

    return successRes(res);
  } catch (error) {
    next(error);
  }
};

const validateRatingInput = async (workerId, jobId, rating, comment) => {
  if (!workerId || !jobId || !rating)
    throw new AppError(400, "Missing details");

  if (rating < 1 || rating > 5)
    throw new AppError(400, "Rating must be between 1 and 5");

  if (comment && comment.trim().length > 200)
    throw new AppError(400, "Comment must be at most 200 characters long");

  const [worker, job] = await Promise.all([
    User.findById(workerId),
    Job.findById(jobId),
  ]);

  if (!worker || worker.role !== USER_ROLE_ENUM.WORKER)
    throw new AppError(400, "Invalid worker ID");

  if (!job) throw new AppError(400, "Invalid job ID");
};
