// Middleware to handle 404 Not Found errors for any routes that don't exist.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware to handle all other errors in a structured way.
// It overrides the default Express error handler.
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code, so we set it to 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose-specific error for bad ObjectIDs
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    // Show the error stack trace only if we are not in production mode.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
