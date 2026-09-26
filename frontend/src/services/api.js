/**
 * Tiny fetch wrapper for the Lumora API.
 * Base URL comes from VITE_API_URL (see frontend/.env.example).
 */
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
// Generous timeout: free hosting (e.g. Render free) can take ~50s to wake up after being idle.
const TIMEOUT_MS = 70000;

export class ApiError extends Error {
  constructor(message, { status = 0, errors } = {}) {
    super(message);
    this.status = status;
    this.errors = errors; // field → message map for validation errors
  }
}

export async function request(path, { method = 'GET', body, token, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(
      err.name === 'AbortError'
        ? 'The request took too long. Please check your connection and try again.'
        : 'We could not reach our server. Please check your connection and try again.'
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || data?.success === false) {
    throw new ApiError(data?.message || `Request failed (${res.status}).`, { status: res.status, errors: data?.errors });
  }
  return data;
}
