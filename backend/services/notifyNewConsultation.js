import env from '../config/env.js';
import Consultation from '../models/Consultation.js';
import { sendMail } from './mailer.js';
import { buildConsultationEmail } from './emailTemplates/consultationEmail.js';

/**
 * Emails the studio team (MAIL_TO) about a newly saved enquiry and records the
 * outcome on the enquiry, so the admin dashboard can show whether the alert went out.
 * Never throws — the visitor's submission has already been saved.
 */
export async function notifyNewConsultation(consultation) {
  if (env.mail.provider !== 'none') {
    console.log(`[mail] New enquiry from ${consultation.name} (${consultation.email}) — sending alert to ${env.mail.to.join(', ')}…`);
  }
  const email = buildConsultationEmail(consultation, { adminUrl: env.mail.adminUrl });
  const result = await sendMail({
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: consultation.email,
    tags: ['consultation'],
  });

  if (result.provider !== 'none') {
    const log = result.sent ? console.log : console.error;
    log(`[mail] ${result.sent ? 'Sent' : 'FAILED'} enquiry alert for ${consultation.id} via ${result.provider}: ${result.detail}`);
  }

  try {
    await Consultation.findByIdAndUpdate(consultation.id, {
      notification: {
        sent: result.sent,
        provider: result.provider,
        detail: String(result.detail || '').slice(0, 500),
        at: new Date(),
      },
    });
  } catch (err) {
    console.error('[mail] Could not record notification status:', err.message);
  }

  return result;
}
