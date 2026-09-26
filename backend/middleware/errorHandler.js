import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Invalid ObjectId in a URL param
  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  }

  // Schema-level validation (a second line of defence behind validate.js)
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return res.status(400).json({ success: false, message: 'Please check the highlighted fields.', errors });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must be valid JSON.' });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  console.error('[error]', err);
  // Never leak stack traces or internals to the client.
  res.status(500).json({ success: false, message: 'Something went wrong on our side. Please try again.' });
}
