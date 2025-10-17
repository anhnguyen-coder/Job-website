import mongoose from "mongoose";
import { JOB_REQUEST_STATUS } from "../../../enums/job.enum.js";
import { JobRequest } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

const STATUS_ORDER = {
  [JOB_REQUEST_STATUS.PENDING]: 1,
  [JOB_REQUEST_STATUS.ACCEPTED]: 2,
  [JOB_REQUEST_STATUS.REJECTED]: 3,
  [JOB_REQUEST_STATUS.CANCELLED]: 4,
};

export const jobRequestList = async (req, res, next) => {
  try {
    const customerIdStr = req.user?.id;
    const { status } = req.query;

    if (status && !Object.values(JOB_REQUEST_STATUS).includes(status)) {
      return AppError(res, 400, "Invalid status value");
    }

    const customerObjectId = new mongoose.Types.ObjectId(customerIdStr);

    const match = { customerId: customerObjectId };
    if (status) match.status = status;

    const { page, limit, skip } = getPagination(req.query);

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: Object.entries(STATUS_ORDER).map(([key, val]) => ({
                case: { $eq: ["$status", key] },
                then: val,
              })),
              default: 99,
            },
          },
        },
      },
      { $sort: { sortOrder: 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: { path: "$worker", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          workerId: "$worker",
          jobId: "$job",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const [rows, total] = await Promise.all([
      JobRequest.aggregate(pipeline),
      JobRequest.countDocuments(match),
    ]);

    const pagination = getPagingData(total, page, limit);

    return successRes(res, {
      data: rows,
      pagy: pagination,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return AppError(res, 500, "Server Error");
  }
};
