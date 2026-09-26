/**
 * Creates (or resets the password of) the studio admin account.
 *
 *   npm run create-admin
 *
 * Reads ADMIN_EMAIL, ADMIN_PASSWORD and optional ADMIN_NAME from backend/.env.
 * You can also pass them inline for one-off use:
 *   ADMIN_EMAIL=me@studio.in ADMIN_PASSWORD='a-long-passphrase' npm run create-admin
 *
 * Only the bcrypt hash is stored. Remove ADMIN_PASSWORD from .env afterwards if you like.
 */
import env from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'Studio Admin';

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env (or inline) before running this script.');
  process.exit(1);
}
if (password.length < 10) {
  console.error('ADMIN_PASSWORD must be at least 10 characters.');
  process.exit(1);
}

await connectDB(env.mongoUri);

const passwordHash = await Admin.hashPassword(password);
const existing = await Admin.findOne({ email });

if (existing) {
  existing.passwordHash = passwordHash;
  existing.name = name;
  await existing.save();
  console.log(`✔ Updated password for existing admin ${email}`);
} else {
  await Admin.create({ email, name, passwordHash });
  console.log(`✔ Created admin ${email}`);
}

await disconnectDB();
