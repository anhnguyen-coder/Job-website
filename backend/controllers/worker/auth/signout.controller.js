import successRes from "../../../pkg/helper/successRes.js";

export const signOut = (req, res) => {
  const { workerToken } = req.cookies;

  if (!workerToken) {
    return AppError(res, 401, "User not authenticated");
  }
  res.clearCookie("workerToken");
  return successRes(res, {
    message: "Sign out successful",
  });
};
