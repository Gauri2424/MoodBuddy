/**
 * Global Express Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR LOG:', err);

  // Read environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred. Please try again later.';

  res.status(status).json({
    success: false,
    message,
    // Only send stack trace in development
    stack: isDevelopment ? err.stack : undefined,
  });
};

export default errorHandler;
