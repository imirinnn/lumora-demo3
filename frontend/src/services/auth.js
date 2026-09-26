import { request } from './api';

/**
 * Admin session helpers.
 * The JWT is kept in sessionStorage: it disappears when the tab/browser closes and
 * expires server-side after JWT_EXPIRES_IN (8h by default). The admin page is never
 * linked from the public site and is marked noindex.
 */
const KEY = 'lumora:admin-token';

export function getToken() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable — session lasts until reload */
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const login = (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } });
export const fetchMe = (token, signal) => request('/api/auth/me', { token, signal });
