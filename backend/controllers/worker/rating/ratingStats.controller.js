import { AppError } from "../../../pkg/helper/errorHandler.js";
import { Rating } from "../../../models/index.js";
import successRes from "../../../pkg/helper/successRes.js";
export const ratingStatsController = async (req, res) => {
  try {
    const workerId = req.user.id;

    const stats = await Rating.aggregate([
      { $match: { targetType: "worker", targetId: workerId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          fiveStars: {
            $sum: {
              $cond: [{ $eq: ["$rating", 5] }, 1, 0],
            },
          },
          positiveCount: {
            $sum: {
              $cond: [{ $gte: ["$rating", 4] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          avgRating: { $round: ["$avgRating", 2] },
          totalRatings: 1,
          fiveStars: 1,
          positiveSentiment: {
            $cond: [
              { $eq: ["$totalRatings", 0] },
              0,
              { $round: [{ $divide: ["$positiveCount", "$totalRatings"] }, 2] },
            ],
          },
        },
      },
    ]);

    successRes(res, {
      data: stats[0] || {
        avgRating: 0,
        totalRatings: 0,
        fiveStars: 0,
        positiveSentiment: 0,
      },
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
