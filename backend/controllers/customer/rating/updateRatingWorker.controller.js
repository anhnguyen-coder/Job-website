import { Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const updateRatingWorker = async (req, res, next) => {
  const { ratingId } = req.params;
  const { rating, comment } = req.body;

  const customerId = req.user.id;
  try {
    validateUpdateRatingInput(rating, comment);

    const rate = await Rating.findById(ratingId);
    if (!rate) throw new AppError(400, "Invalid rating ID");

    if (rate.authorType !== "customer")
      throw new AppError(400, "Only customer can update rating");

    if (rate.authorId.toString() !== customerId)
      throw new AppError(403, "You can only update your own rating");

    rate.rating = rating;
    rate.comment = comment;
    await rate.save();

    return successRes(res);
  } catch (error) {
    next(error);
  }
};

const validateUpdateRatingInput = (rating, comment) => {
  if (!rating || !comment)
    throw new AppError(400, "Rating and comment are required");
  if (rating < 1 || rating > 5)
    throw new AppError(400, "Rating must be between 1 and 5");
};
