export const signOut = (req, res) => {
  res.clearCookie("token");
  return successRes(res, {
    message: "Sign out successful",
  });
};
