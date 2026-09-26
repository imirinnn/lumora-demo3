import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Seo from '../../components/Seo';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { clearToken, fetchMe, getToken, setToken } from '../../services/auth';

/**
 * Lightweight, protected admin area (code-split from the public site).
 *   /admin/login  – sign in
 *   /admin        – enquiries dashboard (requires a valid token)
 */
export default function AdminApp() {
  const [token, setTok] = useState(getToken);
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(!!getToken());
  const [notice, setNotice] = useState('');
  const location = useLocation();

  const signOut = useCallback((message = '') => {
    clearToken();
    setTok(null);
    setAdmin(null);
    setNotice(message);
  }, []);

  // Validate a token restored from sessionStorage
  useEffect(() => {
    if (!token || admin) {
      setChecking(false);
      return undefined;
    }
    const ctrl = new AbortController();
    fetchMe(token, ctrl.signal)
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        if (err.name !== 'AbortError') signOut(err.status === 401 ? 'Your session has expired. Please sign in again.' : '');
      })
      .finally(() => setChecking(false));
    return () => ctrl.abort();
  }, [token, admin, signOut]);

  const onLogin = ({ token: t, admin: a }) => {
    setToken(t);
    setTok(t);
    setAdmin(a);
    setNotice('');
  };

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-bone text-sm text-stone">Checking your session…</div>;
  }

  const authed = !!token && !!admin;

  return (
    <>
      <Seo title="Studio Admin" noindex path={location.pathname} />
      <Routes>
        <Route
          path="/admin/login"
          element={authed ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={onLogin} notice={notice} />}
        />
        <Route
          path="/admin"
          element={authed ? <AdminDashboard token={token} admin={admin} onSignOut={signOut} /> : <Navigate to="/admin/login" replace />}
        />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}
