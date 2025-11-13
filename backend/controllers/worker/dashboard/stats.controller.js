import { JOB_REQUEST_STATUS, JOB_STATUS } from "../../../enums/job.enum.js";
import { Job, JobRequest, Payment, Rating } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";
import mongoose from "mongoose";

const STATUS_JOB = [
  JOB_REQUEST_STATUS.ACCEPTED,
  JOB_REQUEST_STATUS.REJECTED,
  JOB_REQUEST_STATUS.PENDING,
];

export const dashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [jobActivitiesCount, totalSpending, jobCompletedCount, reviewStats] =
      await Promise.all([
        JobRequest.countDocuments({
          workerId: userId,
          status: { $in: STATUS_JOB },
        }),

        Payment.aggregate([
          {
            $match: {
              workerId: mongoose.Types.ObjectId.createFromHexString(userId),
              status: "paid",
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        Job.countDocuments({
          assignedWorkerId: userId,
          status: JOB_STATUS.COMPLETED,
        }),

        Rating.aggregate([
          {
            $match: {
              targetType: "worker",
              targetId: mongoose.Types.ObjectId.createFromHexString(userId),
            },
          },
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
        label: "Total earnings",
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
          ? Number(reviewStats[0].avgRating.toFixed(1))
          : 0,
      },
    ];

    return successRes(res, { data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    AppError(res, 500, error.message);
  }
};
