// Global error handler — must be the last middleware registered in app.js (Express requires the 4-argument signature).
// TODO: in production, 5xx responses should return a generic message instead of err.message to prevent information leakage.
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method}] ${req.path} → ${status}: ${message}`);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
