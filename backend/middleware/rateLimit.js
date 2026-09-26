import rateLimit from 'express-rate-limit';

const base = { standardHeaders: 'draft-7', legacyHeaders: false };

// Public form: generous for real people, tight enough to stop spam floods.
export const enquiryLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 8,
  message: { success: false, message: 'Too many enquiries from this connection. Please try again in a few minutes.' },
});

// Login: slows down password guessing.
export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});
