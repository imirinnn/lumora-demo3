import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { signToken } from '../middleware/auth.js';
import ApiError from '../utils/ApiError.js';

// Used when the email doesn't exist, so a failed login takes the same time either way
// (prevents guessing which emails are registered from response timing).
let dummyHash;
const getDummyHash = async () => (dummyHash ??= await bcrypt.hash('lumora-timing-guard', 12));

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.validated;

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  const ok = admin ? await admin.verifyPassword(password) : await bcrypt.compare(password, await getDummyHash());

  if (!admin || !ok) throw ApiError.unauthorized('Incorrect email or password.');

  admin.lastLoginAt = new Date();
  await admin.save();

  res.json({
    success: true,
    data: {
      token: signToken(admin),
      admin: { id: admin.id, name: admin.name, email: admin.email },
    },
  });
}

/** GET /api/auth/me — returns the signed-in admin (used to validate a stored session) */
export function me(req, res) {
  const { id, name, email } = req.admin;
  res.json({ success: true, data: { id, name, email } });
}
