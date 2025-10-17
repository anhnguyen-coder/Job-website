import { Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateRatingWorker = async (req, res) => {
  const { ratingId } = req.params;
  const { rating, comment } = req.body;

  const customerId = req.user.id;
  try {
    validateUpdateRatingInput(res, rating, comment);

    const rate = await Rating.findById(ratingId);
    if (!rate) return AppError(res, 400, "Invalid rating ID");

    if (rate.authorType !== "customer")
      return AppError(res, 400, "Only customer can update rating");

    if (rate.authorId.toString() !== customerId)
      return AppError(res, 403, "You can only update your own rating");

    rate.rating = rating;
    rate.comment = comment;
    await rate.save();

    return successRes(res);
  } catch (error) {
    AppError(res, 500, error.message);
  }
};

const validateUpdateRatingInput = (res, rating, comment) => {
  if (!rating || !comment)
    return AppError(res, 400, "Rating and comment are required");
  if (rating < 1 || rating > 5)
    return AppError(res, 400, "Rating must be between 1 and 5");
};
