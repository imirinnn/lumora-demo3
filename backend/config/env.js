import 'dotenv/config';

/**
 * Central place for runtime configuration.
 * Every secret comes from environment variables — nothing is hard-coded.
 */
const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `\n[config] Missing required environment variable(s): ${missing.join(', ')}\n` +
      '         Copy backend/.env.example to backend/.env and fill in the values.\n'
  );
  process.exit(1);
}

if (/<[^>]*password[^>]*>/i.test(process.env.MONGODB_URI)) {
  console.error(
    '\n[config] MONGODB_URI still contains a <password> placeholder.\n' +
      '         Replace it with your Atlas database user\'s password (URL-encode special characters, e.g. @ → %40).\n'
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn('[config] JWT_SECRET is shorter than 32 characters. Use a long random value in production.');
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  // Comma-separated list of allowed frontend origins, e.g. "http://localhost:5173,https://lumora.in"
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  /* ── Email notifications for new enquiries ─────────────────── */
  mail: {
    // "brevo" (Brevo HTTP API — works on hosts that block SMTP, e.g. Render free),
    // "mailchimp" (Mailchimp Transactional / Mandrill), "smtp" (e.g. Gmail) or "none"
    provider: (process.env.MAIL_PROVIDER || 'none').trim().toLowerCase(),
    to: list(process.env.MAIL_TO),
    from: (process.env.MAIL_FROM || '').trim(),
    fromName: (process.env.MAIL_FROM_NAME || 'Lumora Interiors Website').trim(),
    adminUrl: (process.env.ADMIN_URL || '').trim().replace(/\/$/, ''),
    mailchimpApiKey: (process.env.MAILCHIMP_TRANSACTIONAL_API_KEY || '').trim(),
    brevoApiKey: (process.env.BREVO_API_KEY || '').trim(),
    mailchimpApiUrl: (process.env.MAILCHIMP_API_URL || 'https://mandrillapp.com/api/1.0').replace(/\/$/, ''),
    smtp: {
      host: (process.env.SMTP_HOST || 'smtp.gmail.com').trim(),
      port: Number(process.env.SMTP_PORT) || 465,
      user: (process.env.SMTP_USER || '').trim(),
      // Gmail app passwords are shown with spaces ("abcd efgh ijkl mnop"); strip them.
      pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
  },
};

function list(value) {
  return (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Returns a list of problems with the email settings (empty when everything needed is present). */
export function mailConfigProblems(mail = env.mail) {
  const problems = [];
  if (mail.provider === 'none') return problems;
  if (!['brevo', 'mailchimp', 'smtp'].includes(mail.provider)) {
    return [`MAIL_PROVIDER must be "brevo", "mailchimp", "smtp" or "none" (got "${mail.provider}").`];
  }
  if (!mail.to.length) problems.push('MAIL_TO is empty — add at least one recipient.');
  if (mail.provider === 'mailchimp') {
    if (!mail.mailchimpApiKey) problems.push('MAILCHIMP_TRANSACTIONAL_API_KEY is missing.');
    if (!mail.from) problems.push('MAIL_FROM is missing — it must be an address on your verified Mailchimp sending domain.');
    else if (/@(gmail|yahoo|outlook|hotmail|icloud)\./i.test(mail.from)) {
      problems.push(`MAIL_FROM (${mail.from}) is a free email address. Mailchimp Transactional only sends from a domain you own and have verified.`);
    }
  }
  if (mail.provider === 'brevo') {
    if (!mail.brevoApiKey) problems.push('BREVO_API_KEY is missing (Brevo → SMTP & API → API Keys).');
    if (!mail.from) problems.push('MAIL_FROM is missing — use the sender email you verified in Brevo (e.g. your Gmail).');
  }
  if (mail.provider === 'smtp') {
    if (!mail.smtp.user) problems.push('SMTP_USER is missing (your Gmail address).');
    if (!mail.smtp.pass) problems.push('SMTP_PASS is missing (Gmail app password, or your GMass API key).');
    else if (/[<>]/.test(mail.smtp.pass)) problems.push('SMTP_PASS still contains a <placeholder> — paste your real app password.');
    // Only Gmail's own SMTP uses your mailbox as the login. Relays (Brevo, GMass, …) log in with
    // a service username, so the sender address must be given explicitly.
    if (!mail.from && mail.smtp.host !== 'smtp.gmail.com') {
      problems.push(`MAIL_FROM is missing — with ${mail.smtp.host} set it to your verified sender address (e.g. your Gmail).`);
    }
  }
  return problems;
}

const mailProblems = mailConfigProblems();
if (mailProblems.length) {
  console.warn(`[config] Email notifications are OFF until these are fixed:\n  - ${mailProblems.join('\n  - ')}`);
} else if (env.mail.provider === 'none') {
  console.warn('[config] MAIL_PROVIDER=none — enquiries are saved but no email alerts are sent.');
}

export default env;
