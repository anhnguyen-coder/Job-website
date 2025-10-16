import { Bookmark } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import { getPagination, getPagingData } from "../../../pkg/helper/pagy.js";
import successRes from "../../../pkg/helper/successRes.js";

export const bookmarkList = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const { page, limit, skip } = getPagination(req.query);
    const [bookmarks, total] = await Promise.all([
      Bookmark.find({ workerId: workerId })
        .skip(skip)
        .limit(limit)
        .populate("jobId")
        .sort({ createdAt: -1 }),
      Bookmark.countDocuments({ workerId: workerId }),
    ]);
    const pagy = getPagingData(total, page, limit);

    return successRes(res, { data: bookmarks, status: 200, pagy: pagy });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
