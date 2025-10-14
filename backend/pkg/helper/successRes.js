const successRes = (res, { data = null, status = 200, pagy } = {}) => {
  return res.status(status).json({
    success: true,
    message: "Thành công",
    data,
    pagy,
  });
};

export default successRes;
