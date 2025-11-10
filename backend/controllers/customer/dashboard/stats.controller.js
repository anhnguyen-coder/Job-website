import { JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, Payment, Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import mongoose from "mongoose";

const STATUS_JOB = [
  JOB_STATUS.TAKEN,
  JOB_STATUS.IN_PROGRESS,
  JOB_STATUS.CHECK_COMPLETE,
  JOB_STATUS.COMPLETED,
  JOB_STATUS.CANCELLED,
];

export const dashboardStats = async (req, res) => {
  try {
    const customerId = req.user.id;

    const [jobActivitiesCount, totalSpending, jobCompletedCount, reviewStats] =
      await Promise.all([
        Job.countDocuments({
          customerId,
          status: { $in: STATUS_JOB },
        }),

        Payment.aggregate([
          {
            $match: {
              customerId:
                mongoose.Types.ObjectId.createFromHexString(customerId),
              status: "paid",
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        Job.countDocuments({
          customerId,
          status: JOB_STATUS.COMPLETED,
        }),

        Rating.aggregate([
          { $match: { targetType: "customer", targetId: customerId } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]),
      ]);

    const stats = [
      {
        id: 1,
        label: "Work activities",
        value: jobActivitiesCount || 0,
      },
      {
        id: 2,
        label: "Total spending",
        value: totalSpending?.[0]?.total || 0,
      },
      {
        id: 3,
        label: "Total job completed",
        value: jobCompletedCount || 0,
      },
      {
        id: 4,
        label: "Ratings",
        value: reviewStats?.[0]?.avgRating
          ? Math.round(reviewStats[0].avgRating)
          : 0,
      },
    ];

    return successRes(res, { data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    AppError(res, 500, error.message);
  }
};
