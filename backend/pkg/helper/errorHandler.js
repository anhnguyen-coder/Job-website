export const AppError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    message: message,
  });
};
