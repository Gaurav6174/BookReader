/**
 * Central error-handling middleware.
 * Must have 4 parameters for Express to treat it as an error handler.
 */
export function errorHandler(err, req, res, next) {
  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'This word is already saved in this chapter.',
        details: err.keyValue,
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ error: { message: 'Validation failed', details } });
  }

  // Zod validation error (thrown by validate middleware)
  if (err.name === 'ZodError') {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ error: { message: 'Validation failed', details } });
  }

  // Custom app errors
  if (err.status) {
    return res.status(err.status).json({ error: { message: err.message } });
  }

  // Default: 500 — never leak stack traces
  console.error('[Error]', err);
  res.status(500).json({ error: { message: 'An internal server error occurred.' } });
}
