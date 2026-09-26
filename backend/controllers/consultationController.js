import Consultation, { STATUSES } from '../models/Consultation.js';
import ApiError from '../utils/ApiError.js';
import { notifyNewConsultation } from '../services/notifyNewConsultation.js';

const EMAIL_WAIT_MS = 8000;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** POST /api/consultations — public */
export async function createConsultation(req, res) {
  // Honeypot hit: respond exactly like a success so bots learn nothing, but store nothing.
  if (req.isSpam) {
    return res.status(201).json({ success: true, message: 'Thank you. Our design team will be in touch shortly.' });
  }

  const consultation = await Consultation.create(req.validated);

  // Email the studio team. The enquiry is already saved, so a slow or failing mail
  // provider can never lose it: we wait at most EMAIL_WAIT_MS, then reply regardless.
  await Promise.race([
    notifyNewConsultation(consultation),
    new Promise((resolve) => setTimeout(resolve, EMAIL_WAIT_MS).unref?.()),
  ]);

  // Only return what the visitor needs — never echo the whole record.
  res.status(201).json({
    success: true,
    message: 'Thank you. Our design team will be in touch shortly.',
    data: { id: consultation.id, createdAt: consultation.createdAt },
  });
}

/** GET /api/consultations — admin. Supports ?status=&search=&page=&limit= */
export async function listConsultations(req, res) {
  const { status, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  const filter = {};
  if (status && STATUSES.includes(status)) filter.status = status;
  if (typeof search === 'string' && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim().slice(0, 80)), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { location: rx }, { phone: rx }];
  }

  const [items, total] = await Promise.all([
    Consultation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Consultation.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  });
}

/** GET /api/consultations/stats — admin */
export async function consultationStats(_req, res) {
  const counts = await Promise.all(STATUSES.map((s) => Consultation.countDocuments({ status: s })));
  const byStatus = Object.fromEntries(STATUSES.map((s, i) => [s, counts[i]]));
  const total = counts.reduce((a, b) => a + b, 0);
  res.json({ success: true, data: { total, byStatus } });
}

/** GET /api/consultations/:id — admin */
export async function getConsultation(req, res) {
  const item = await Consultation.findById(req.params.id);
  if (!item) throw ApiError.notFound('Enquiry not found.');
  res.json({ success: true, data: item });
}

/** PATCH /api/consultations/:id/status — admin */
export async function updateConsultationStatus(req, res) {
  const item = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: req.validated.status },
    { new: true, runValidators: true }
  );
  if (!item) throw ApiError.notFound('Enquiry not found.');
  res.json({ success: true, message: `Status updated to ${item.status}.`, data: item });
}
