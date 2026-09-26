import env, { mailConfigProblems } from '../config/env.js';

/**
 * Sends one email through the configured provider.
 *
 *   MAIL_PROVIDER=mailchimp → Mailchimp Transactional (Mandrill) HTTP API. No SDK needed.
 *   MAIL_PROVIDER=smtp      → any SMTP server via Nodemailer (e.g. Gmail + app password).
 *   MAIL_PROVIDER=none      → does nothing.
 *
 * Resolves to { sent: boolean, provider, detail } and never throws, so a mail
 * problem can never break a form submission.
 */
export async function sendMail({ to = env.mail.to, subject, html, text, replyTo, tags = [] }) {
  const mail = env.mail;
  const problems = mailConfigProblems(mail);
  if (mail.provider === 'none') return { sent: false, provider: 'none', detail: 'Email notifications are turned off (MAIL_PROVIDER=none).' };
  if (problems.length) return { sent: false, provider: mail.provider, detail: problems.join(' ') };

  const cleanSubject = String(subject).replace(/[\r\n]+/g, ' ').slice(0, 200);

  try {
    if (mail.provider === 'mailchimp') return await sendViaMailchimp({ mail, to, subject: cleanSubject, html, text, replyTo, tags });
    return await sendViaSmtp({ mail, to, subject: cleanSubject, html, text, replyTo });
  } catch (err) {
    return { sent: false, provider: mail.provider, detail: mail.provider === 'smtp' ? explainSmtpError(err, mail) : err.message || String(err) };
  }
}

/* ── Mailchimp Transactional ─────────────────────────────────────────
   Docs: https://mailchimp.com/developer/transactional/api/messages/send-new-message/ */
async function sendViaMailchimp({ mail, to, subject, html, text, replyTo, tags }) {
  const res = await fetch(`${mail.mailchimpApiUrl}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      key: mail.mailchimpApiKey,
      message: {
        from_email: mail.from,
        from_name: mail.fromName,
        subject,
        html,
        text,
        to: to.map((email) => ({ email, type: 'to' })),
        headers: replyTo ? { 'Reply-To': replyTo } : undefined,
        important: true,
        track_opens: false,
        track_clicks: false, // keep links in the alert exactly as written
        preserve_recipients: true, // both recipients can see who else got the alert
        tags,
      },
    }),
  });

  const body = await res.json().catch(() => null);

  // API-level error, e.g. { status: 'error', name: 'Invalid_Key', message: '…' }
  if (!res.ok || !Array.isArray(body)) {
    const why = body?.message || `HTTP ${res.status}`;
    return { sent: false, provider: 'mailchimp', detail: `Mailchimp error: ${body?.name ? `${body.name} — ` : ''}${why}` };
  }

  // One result per recipient: sent | queued | scheduled | rejected | invalid
  const failed = body.filter((r) => !['sent', 'queued', 'scheduled'].includes(r.status));
  if (failed.length === body.length) {
    return {
      sent: false,
      provider: 'mailchimp',
      detail: failed.map((r) => `${r.email}: ${r.status}${r.reject_reason ? ` (${r.reject_reason})` : ''}`).join('; '),
    };
  }
  return {
    sent: true,
    provider: 'mailchimp',
    detail: body.map((r) => `${r.email}: ${r.status}${r.reject_reason ? ` (${r.reject_reason})` : ''}`).join('; '),
  };
}

/* ── SMTP (Gmail or any other mail server) ─────────────────────────── */
let transporter;

/** Turns common SMTP errors into a plain-English fix. */
export function explainSmtpError(err, mail = env.mail) {
  const msg = err?.message || String(err);
  if (/535|BadCredentials|Invalid login/i.test(msg)) {
    return `${msg}\n  → Gmail rejected SMTP_USER / SMTP_PASS. The app password must be created while signed in to ${mail.smtp.user} (https://myaccount.google.com/apppasswords), with 2-Step Verification ON. If you created it on a different Gmail account, change SMTP_USER to that account.`;
  }
  if (/ETIMEDOUT|ECONNREFUSED|ENOTFOUND|ESOCKET/i.test(msg)) {
    return `${msg}\n  → Could not reach ${mail.smtp.host}:${mail.smtp.port}. A firewall, antivirus or network may be blocking it — try another network, or SMTP_PORT=587.`;
  }
  return msg;
}

async function getTransporter(mail) {
  if (!transporter) {
    const { default: nodemailer } = await import('nodemailer');
    transporter = nodemailer.createTransport({
      host: mail.smtp.host,
      port: mail.smtp.port,
      secure: mail.smtp.port === 465,
      auth: { user: mail.smtp.user, pass: mail.smtp.pass },
      connectionTimeout: 10000,
    });
  }
  return transporter;
}

/** Logs in to the SMTP server once at startup so problems show up immediately in the terminal. */
export async function verifyMailSetup() {
  const mail = env.mail;
  const problems = mailConfigProblems(mail);
  if (mail.provider === 'none') return console.log('[mail] Email alerts are OFF (MAIL_PROVIDER=none).');
  console.log(`[mail] Provider: ${mail.provider} · recipients: ${mail.to.join(', ') || '(none)'}`);
  if (problems.length) return console.error(`[mail] ✘ Not configured:\n  - ${problems.join('\n  - ')}`);
  if (mail.provider !== 'smtp') return console.log('[mail] Mailchimp settings present.');
  console.log(`[mail] Checking login to ${mail.smtp.host}:${mail.smtp.port} as ${mail.smtp.user} (app password: ${mail.smtp.pass.length} characters)…`);
  try {
    await (await getTransporter(mail)).verify();
    console.log('[mail] ✔ Login OK — enquiry emails will be sent.');
  } catch (err) {
    console.error(`[mail] ✘ Login FAILED: ${explainSmtpError(err, mail)}`);
  }
}

async function sendViaSmtp({ mail, to, subject, html, text, replyTo }) {
  const t = await getTransporter(mail);
  const info = await t.sendMail({
    from: { name: mail.fromName, address: mail.from || mail.smtp.user }, // GMass: MAIL_FROM = your connected Gmail
    to,
    replyTo,
    subject,
    html,
    text,
  });
  const accepted = info.accepted?.length ?? 0;
  return {
    sent: accepted > 0,
    provider: 'smtp',
    detail: accepted > 0 ? `accepted: ${info.accepted.join(', ')}` : `rejected: ${(info.rejected || []).join(', ')}`,
  };
}
