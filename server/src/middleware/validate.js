import mongoose from 'mongoose';

/**
 * Returns a 404 AppError with the given message.
 */
export function notFoundError(msg) {
  const err = new Error(msg);
  err.status = 404;
  return err;
}

/**
 * Returns a 409 AppError.
 */
export function conflictError(msg) {
  const err = new Error(msg);
  err.status = 409;
  return err;
}

/**
 * Validate that a string is a valid MongoDB ObjectId.
 * Throws a 404 AppError if not valid (not 500).
 */
export function assertValidId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw notFoundError(`Invalid or unknown ${label}: ${id}`);
  }
}

/**
 * Factory: returns Express middleware that validates req.body against a Zod schema.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = result.error;
      err.name = 'ZodError';
      return next(err);
    }
    req.body = result.data; // replace with parsed/coerced data
    next();
  };
}
