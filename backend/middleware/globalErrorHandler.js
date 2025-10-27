export const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  if (res.headersSent) return next(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
