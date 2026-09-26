import { request } from './api';

/** Public: submit the consultation form. */
export const submitConsultation = (payload) => request('/api/consultations', { method: 'POST', body: payload });

/* ─── Admin ─────────────────────────────────────────── */

export function listConsultations(token, { status, search, page = 1, limit = 10 } = {}, signal) {
  const qs = new URLSearchParams();
  if (status && status !== 'All') qs.set('status', status);
  if (search) qs.set('search', search);
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  return request(`/api/consultations?${qs}`, { token, signal });
}

export const getConsultationStats = (token, signal) => request('/api/consultations/stats', { token, signal });

export const updateConsultationStatus = (token, id, status) =>
  request(`/api/consultations/${id}/status`, { method: 'PATCH', body: { status }, token });
