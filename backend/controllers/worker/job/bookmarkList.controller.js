import { Bookmark } from "../../../models/index.js";
import { AppError } from "../../../pkg/helper/errorHandler.js";
import successRes from "../../../pkg/helper/successRes.js";

export const bookmarkList = async (req, res, next) => {
  try {
    const workerId = req.user.id;

    const bookmarks = await Bookmark.find({ workerId }).populate("jobId");

    return successRes(res, { data: bookmarks, status: 200 });
  } catch (error) {
    next(error);
    AppError(500, "Server Error");
  }
};
