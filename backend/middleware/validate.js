import ApiError from '../utils/ApiError.js';
import { BUDGETS, PROJECT_TYPES, STATUSES } from '../models/Consultation.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Accepts Indian and international numbers: digits, spaces, dashes, brackets, optional leading +
const PHONE_RE = /^\+?[\d\s()-]{8,20}$/;

const str = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Validates and whitelists the public consultation payload.
 * Unknown fields (e.g. someone trying to set `status`) are dropped.
 */
export function validateConsultation(req, _res, next) {
  const body = req.body || {};

  // Honeypot: real visitors never see or fill this field. Bots usually do.
  if (str(body.website)) {
    req.isSpam = true;
    return next();
  }

  const data = {
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone),
    projectType: str(body.projectType),
    location: str(body.location),
    budget: str(body.budget),
    message: str(body.message),
  };

  const errors = {};
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(data.email) || data.email.length > 120) errors.email = 'Please enter a valid email address.';
  const digits = data.phone.replace(/\D/g, '');
  if (!PHONE_RE.test(data.phone) || digits.length < 8 || digits.length > 15)
    errors.phone = 'Please enter a valid phone number.';
  if (!PROJECT_TYPES.includes(data.projectType)) errors.projectType = 'Please choose a project type.';
  if (data.location.length < 2 || data.location.length > 120) errors.location = 'Please tell us where the project is.';
  if (!BUDGETS.includes(data.budget)) errors.budget = 'Please choose an approximate budget.';
  if (data.message.length < 10) errors.message = 'Please share a little more about your project (10+ characters).';
  if (data.message.length > 2000) errors.message = 'Please keep your message under 2000 characters.';

  if (Object.keys(errors).length) {
    return next(ApiError.badRequest('Please check the highlighted fields.', errors));
  }

  req.validated = data;
  next();
}

export function validateStatus(req, _res, next) {
  const status = str(req.body?.status);
  if (!STATUSES.includes(status)) {
    return next(ApiError.badRequest(`Status must be one of: ${STATUSES.join(', ')}.`));
  }
  req.validated = { status };
  next();
}

export function validateLogin(req, _res, next) {
  const email = str(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password || password.length > 200) {
    return next(ApiError.badRequest('Email and password are required.'));
  }
  req.validated = { email, password };
  next();
}
