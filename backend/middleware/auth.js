import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';

export function signToken(admin) {
  return jwt.sign({ sub: admin.id, role: 'admin' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    algorithm: 'HS256',
  });
}

/**
 * Protects admin routes. Expects `Authorization: Bearer <token>`.
 * Verifies the signature and that the admin account still exists.
 */
export async function requireAdmin(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(ApiError.unauthorized());

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    return next(ApiError.unauthorized('Your session has expired. Please sign in again.'));
  }

  if (payload.role !== 'admin' || !mongoose.isValidObjectId(payload.sub)) return next(ApiError.unauthorized());

  const admin = await Admin.findById(payload.sub);
  if (!admin) return next(ApiError.unauthorized());

  req.admin = admin;
  next();
}
