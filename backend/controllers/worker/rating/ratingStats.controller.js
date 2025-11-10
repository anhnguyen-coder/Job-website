import { AppError } from "../../../pkg/helper/errorHandler.js";
import { Rating } from "../../../models/index.js";
import successRes from "../../../pkg/helper/successRes.js";
import mongoose from "mongoose";
export const ratingStatsController = async (req, res) => {
  try {
    const workerId = req.user.id;

    const stats = await Rating.aggregate([
      {
        $match: {
          targetType: "worker",
          targetId: mongoose.Types.ObjectId.createFromHexString(workerId),
        },
      },
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

    // Rating distribution (1-5 stars)
    const ratingDistribution = await Rating.aggregate([
      {
        $match: {
          targetType: "worker",
          targetId: mongoose.Types.ObjectId.createFromHexString(workerId),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach((r) => {
      ratingDist[r._id] = r.count;
    });

    const sentimentDistribution = await Rating.aggregate([
      {
        $match: {
          targetType: "worker",
          targetId: mongoose.Types.ObjectId.createFromHexString(workerId),
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$rating", 2] }, then: "negative" },
                { case: { $eq: ["$rating", 3] }, then: "neutral" },
                { case: { $gte: ["$rating", 4] }, then: "positive" },
              ],
              default: "neutral",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object
    const sentimentDist = { positive: 0, neutral: 0, negative: 0 };
    sentimentDistribution.forEach((s) => {
      sentimentDist[s._id] = s.count;
    });

    const data = {
      stats: stats[0] || {
        avgRating: 0,
        totalRatings: 0,
        fiveStars: 0,
        positiveSentiment: 0,
      },
      ratingDistribution: ratingDist,
      sentimentDistribution: sentimentDist,
    };

    successRes(res, {
      data: data,
    });
  } catch (error) {
    AppError(res, 500, error.message);
  }
};
