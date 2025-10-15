import successRes from "../../../pkg/helper/successRes.js";

export const signOut = (req, res) => {
  const { customerToken } = req.cookies;

  if (!customerToken) {
    return AppError(res, 401, "User not authenticated");
  }
  res.clearCookie("customerToken");
  return successRes(res, {
    message: "Sign out successful",
  });
};
