import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../services/auth';
import { EASE } from '../../animations/motion';
import Img from '../../components/Img';
import { images } from '../../data/images';

export default function AdminLogin({ onLogin, notice }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(email.trim(), password);
      onLogin(res.data);
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-bone lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Img image={images.studio} sizes="50vw" priority />
        <div className="absolute inset-0 bg-ink/35" />
        <p className="absolute bottom-10 left-10 font-display text-3xl tracking-[0.3em] text-bone">LUMORA</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="eyebrow text-umber">Studio Admin</p>
          <h1 className="display-md mt-4">Sign in</h1>
          <p className="mt-3 text-sm text-stone">Manage consultation enquiries.</p>

          {notice && !error && (
            <p role="status" className="mt-8 border-l-2 border-clay bg-linen px-4 py-3 text-sm">{notice}</p>
          )}

          <form onSubmit={submit} className="mt-10 space-y-6" noValidate>
            <div>
              <label htmlFor="admin-email" className="meta-label">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="meta-label">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                required
              />
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-[#9b3b2e] bg-[#9b3b2e]/5 px-4 py-3 text-sm text-[#7d2f25]">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-dark w-full" disabled={loading} aria-busy={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <Link to="/" className="link-u mt-10 inline-block text-sm text-stone">← Back to website</Link>
        </motion.div>
      </div>
    </main>
  );
}
