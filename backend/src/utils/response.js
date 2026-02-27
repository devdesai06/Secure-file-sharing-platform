export const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};