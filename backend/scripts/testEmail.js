/**
 * Sends a sample "new enquiry" alert to MAIL_TO so you can check your email setup
 * without filling in the website form. Does not touch the database.
 *
 *   npm run test-email
 */
import env, { mailConfigProblems } from '../config/env.js';
import { sendMail } from '../services/mailer.js';
import { buildConsultationEmail } from '../services/emailTemplates/consultationEmail.js';

const problems = mailConfigProblems();
if (env.mail.provider === 'none' || problems.length) {
  console.error('\nEmail is not configured yet:');
  if (env.mail.provider === 'none') console.error('  - MAIL_PROVIDER is "none". Set it to "mailchimp" or "smtp".');
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error('\nSee README → "Email notifications".\n');
  process.exit(1);
}

const sample = {
  id: 'TEST00000000000000000001',
  name: 'Test Enquiry (sample)',
  email: env.mail.to[0],
  phone: '+91 98765 43210',
  projectType: 'Residential',
  location: 'Chennai',
  budget: '₹25–50 Lakhs',
  message: 'This is a test alert from `npm run test-email`.\nIf you can read this, enquiry emails are working.',
  createdAt: new Date(),
};

const email = buildConsultationEmail(sample, { adminUrl: env.mail.adminUrl });
console.log(`Sending test alert via ${env.mail.provider} to: ${env.mail.to.join(', ')} …`);
const result = await sendMail({ subject: `[TEST] ${email.subject}`, html: email.html, text: email.text, replyTo: sample.email });

if (result.sent) {
  console.log(`✔ Sent. ${result.detail}\n  Check the inboxes (and the Spam / Promotions tabs the first time).`);
} else {
  console.error(`✘ Not sent: ${result.detail}`);
  process.exit(1);
}
