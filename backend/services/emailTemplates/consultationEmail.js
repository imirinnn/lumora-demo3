/**
 * "New enquiry" alert sent to the studio team.
 * Plain tables + inline styles so it renders the same in Gmail, Outlook and phone mail apps.
 * Every visitor-supplied value is HTML-escaped.
 */

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const C = { bg: '#F4EFE7', card: '#FFFFFF', ink: '#1D1B19', muted: '#6A645C', line: '#E4DCCF', accent: '#7A5A40', soft: '#EBE4D9' };

function formatDate(date) {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) + ' IST';
}

/** "+91 98765 43210" → "919876543210" for WhatsApp links (assumes India for 10-digit numbers). */
function whatsappNumber(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits;
}

export function buildConsultationEmail(c, { adminUrl = '', siteName = 'Lumora Interiors' } = {}) {
  const received = formatDate(c.createdAt || Date.now());
  const shortRef = String(c.id || c._id || '').slice(-6).toUpperCase();
  const subject = `New enquiry: ${c.name} · ${c.projectType} · ${c.location}`;
  const replySubject = encodeURIComponent(`Re: Your ${c.projectType.toLowerCase()} project enquiry — ${siteName}`);
  const telHref = `tel:${String(c.phone).replace(/[^\d+]/g, '')}`;
  const waHref = `https://wa.me/${whatsappNumber(c.phone)}`;

  const rows = [
    ['Name', esc(c.name)],
    ['Email', `<a href="mailto:${esc(c.email)}" style="color:${C.accent};text-decoration:none;">${esc(c.email)}</a>`],
    ['Phone', `<a href="${esc(telHref)}" style="color:${C.accent};text-decoration:none;">${esc(c.phone)}</a>`],
    ['Project type', esc(c.projectType)],
    ['Location', esc(c.location)],
    ['Budget', esc(c.budget)],
    ['Received', esc(received)],
  ];

  const button = (href, label, primary) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;${
      primary ? `background:${C.ink};color:#F4EFE7;` : `background:${C.soft};color:${C.ink};`
    }">${label}</a>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(c.name)} · ${esc(c.projectType)} · ${esc(c.location)} · ${esc(c.budget)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.ink};">

      <tr><td style="padding:0 4px 18px;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:6px;color:${C.ink};">LUMORA</span>
        <span style="font-size:10px;letter-spacing:3px;color:${C.muted};padding-left:6px;">INTERIORS</span>
      </td></tr>

      <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:30px 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.accent};font-weight:600;">New consultation enquiry</p>
        <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.2;color:${C.ink};">${esc(c.name)}</h1>
        <p style="margin:0 0 22px;font-size:14px;color:${C.muted};">${esc(c.projectType)} project in ${esc(c.location)} · ${esc(c.budget)}</p>

        <div style="margin:0 0 22px;">
          ${button(`mailto:${c.email}?subject=${replySubject}`, 'Reply by email', true)}
          ${button(telHref, 'Call', false)}
          ${button(waHref, 'WhatsApp', false)}
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};font-size:14px;">
          ${rows
            .map(
              ([k, v]) => `<tr>
            <td valign="top" style="width:120px;padding:11px 12px 11px 0;border-bottom:1px solid ${C.line};color:${C.muted};font-size:12px;letter-spacing:1px;text-transform:uppercase;">${k}</td>
            <td valign="top" style="padding:11px 0;border-bottom:1px solid ${C.line};color:${C.ink};">${v}</td>
          </tr>`
            )
            .join('')}
        </table>

        <p style="margin:24px 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Message</p>
        <div style="background:${C.bg};border-left:3px solid ${C.accent};border-radius:6px;padding:16px 18px;font-size:15px;line-height:1.6;color:${C.ink};white-space:pre-line;">${esc(c.message)}</div>

        ${
          adminUrl
            ? `<p style="margin:26px 0 0;"><a href="${esc(adminUrl)}/admin" style="color:${C.accent};font-size:13px;font-weight:600;text-decoration:none;">Open in admin dashboard →</a></p>`
            : ''
        }
      </td></tr>

      <tr><td style="padding:16px 6px;font-size:12px;line-height:1.6;color:${C.muted};">
        Reference #${esc(shortRef)} · Status: New<br>
        Sent automatically by the ${esc(siteName)} website. Hitting “Reply” writes straight to ${esc(c.email)}.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `NEW CONSULTATION ENQUIRY — ${siteName}`,
    '',
    `Name:          ${c.name}`,
    `Email:         ${c.email}`,
    `Phone:         ${c.phone}`,
    `WhatsApp:      ${waHref}`,
    `Project type:  ${c.projectType}`,
    `Location:      ${c.location}`,
    `Budget:        ${c.budget}`,
    `Received:      ${received}`,
    '',
    'Message:',
    c.message,
    '',
    `Reference #${shortRef} · Status: New`,
    adminUrl ? `Admin: ${adminUrl}/admin` : '',
    `Reply to this email to answer ${c.name} directly.`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  return { subject, html, text };
}
