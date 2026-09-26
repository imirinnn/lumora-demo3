import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getConsultationStats, listConsultations, updateConsultationStatus } from '../../services/consultations';
import { EASE } from '../../animations/motion';

const STATUSES = ['New', 'Contacted', 'Completed'];
const FILTERS = ['All', ...STATUSES];
const PAGE_SIZE = 10;

const STATUS_STYLE = {
  New: 'bg-clay/15 text-umber',
  Contacted: 'bg-[#6f8189]/15 text-[#3f5058]',
  Completed: 'bg-charcoal/10 text-charcoal',
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

function StatusSelect({ value, onChange, disabled, id, label }) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="rounded-full border border-line bg-bone px-3 py-1.5 text-sm disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

function DetailPanel({ item, onClose, onStatus, saving }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const rows = [
    ['Email', <a key="e" href={`mailto:${item.email}`} className="link-u">{item.email}</a>],
    ['Phone', <a key="p" href={`tel:${item.phone.replace(/\s/g, '')}`} className="link-u">{item.phone}</a>],
    ['Project type', item.projectType],
    ['Location', item.location],
    ['Budget', item.budget],
    ['Received', fmtDate(item.createdAt)],
    [
      'Email alert',
      !item.notification || item.notification.provider === 'none' ? (
        <span key="n" className="text-stone">Not sent (email alerts are off)</span>
      ) : item.notification.sent ? (
        <span key="n">Sent to the team</span>
      ) : (
        <span key="n" className="text-[#7d2f25]" title={item.notification.detail}>
          Failed: {item.notification.detail}
        </span>
      ),
    ],
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close details" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-bone shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-6 sm:p-8">
          <div>
            <p className="meta-label">Enquiry</p>
            <h2 id="detail-title" className="display-sm mt-2">{item.name}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm hover:border-charcoal">
            Close
          </button>
        </div>

        <dl className="divide-y divide-line px-6 sm:px-8">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-4 py-4 text-sm">
              <dt className="text-stone">{k}</dt>
              <dd className="col-span-2 break-words">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="px-6 py-6 sm:px-8">
          <p className="meta-label mb-3">Message</p>
          <p className="whitespace-pre-line rounded-sm bg-linen p-5 text-sm leading-relaxed">{item.message}</p>
        </div>

        <div className="mt-auto border-t border-line p-6 sm:p-8">
          <p className="meta-label mb-4" id="status-group-label">Status</p>
          <div role="group" aria-labelledby="status-group-label" className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={saving}
                aria-pressed={item.status === s}
                onClick={() => item.status !== s && onStatus(item, s)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  item.status === s ? 'border-charcoal bg-charcoal text-bone' : 'border-line hover:border-charcoal'
                } disabled:opacity-60`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

export default function AdminDashboard({ token, admin, onSignOut }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const closeDetail = useCallback(() => setSelected(null), []);

  const handleError = useCallback(
    (err) => {
      if (err.name === 'AbortError') return;
      if (err.status === 401) onSignOut('Your session has expired. Please sign in again.');
      else setError(err.message);
    },
    [onSignOut]
  );

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load enquiries
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError('');
    listConsultations(token, { status: filter, search: query, page, limit: PAGE_SIZE }, ctrl.signal)
      .then((res) => setData({ items: res.data, pagination: res.pagination }))
      .catch(handleError)
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [token, filter, query, page, reloadKey, handleError]);

  // Load counts
  useEffect(() => {
    const ctrl = new AbortController();
    getConsultationStats(token, ctrl.signal)
      .then((res) => setStats(res.data))
      .catch(handleError);
    return () => ctrl.abort();
  }, [token, reloadKey, handleError]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const changeStatus = async (item, status) => {
    setSavingId(item.id);
    try {
      const res = await updateConsultationStatus(token, item.id, status);
      const updated = res.data;
      setData((d) => ({ ...d, items: d.items.map((x) => (x.id === updated.id ? updated : x)) }));
      setSelected((s) => (s && s.id === updated.id ? updated : s));
      setStats((s) =>
        s ? { ...s, byStatus: { ...s.byStatus, [item.status]: s.byStatus[item.status] - 1, [status]: s.byStatus[status] + 1 } } : s
      );
      setToast(`${updated.name} marked as ${status}.`);
    } catch (err) {
      handleError(err);
      setToast(`Could not update status: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const { items, pagination } = data;
  const statCards = [
    ['All', stats?.total],
    ['New', stats?.byStatus?.New],
    ['Contacted', stats?.byStatus?.Contacted],
    ['Completed', stats?.byStatus?.Completed],
  ];

  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b border-line bg-bone">
        <div className="container-lux flex h-16 items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="font-display text-xl tracking-[0.3em]">LUMORA</Link>
            <span className="meta-label hidden sm:inline">Studio Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-stone sm:inline">{admin.email}</span>
            <button type="button" onClick={() => onSignOut()} className="rounded-full border border-line px-4 py-2 hover:border-charcoal">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-lux py-10 sm:py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="display-md">Consultation enquiries</h1>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="link-u self-start text-sm text-stone sm:self-auto">
            Refresh
          </button>
        </div>

        {/* Status summary — doubles as a filter */}
        <div className="mt-8 grid grid-cols-2 gap-px bg-line sm:grid-cols-4" role="group" aria-label="Filter by status">
          {statCards.map(([label, value]) => (
            <button
              key={label}
              type="button"
              aria-pressed={filter === label}
              onClick={() => {
                setFilter(label);
                setPage(1);
              }}
              className={`p-5 text-left transition-colors ${filter === label ? 'bg-charcoal text-bone' : 'bg-bone hover:bg-linen'}`}
            >
              <span className={`text-xs uppercase tracking-[0.18em] ${filter === label ? 'text-mist' : 'text-stone'}`}>
                {label === 'All' ? 'Total' : label}
              </span>
              <span className="mt-2 block font-display text-4xl">{value ?? '—'}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search enquiries</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or location"
              className="w-full rounded-full border border-line bg-transparent px-5 py-3 text-sm focus:border-charcoal focus:outline-none"
            />
          </label>
          <p className="text-sm text-stone" aria-live="polite">
            {loading ? 'Loading…' : `${pagination.total} ${pagination.total === 1 ? 'enquiry' : 'enquiries'}`}
          </p>
        </div>

        {/* States */}
        {error && (
          <div role="alert" className="mt-8 flex flex-col items-start gap-4 border-l-2 border-[#9b3b2e] bg-[#9b3b2e]/5 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[#7d2f25]">{error}</span>
            <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="rounded-full border border-charcoal px-4 py-2">
              Try again
            </button>
          </div>
        )}

        {!error && loading && items.length === 0 && (
          <div className="mt-8 space-y-px" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-linen" />
            ))}
          </div>
        )}

        {!error && !loading && items.length === 0 && (
          <div className="mt-8 border border-dashed border-line p-12 text-center">
            <p className="font-display text-2xl">No enquiries yet.</p>
            <p className="mt-2 text-sm text-stone">
              {query || filter !== 'All' ? 'Try a different search or filter.' : 'New consultation requests from the website will appear here.'}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className={`mt-8 transition-opacity ${loading ? 'opacity-50' : ''}`}>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.15em] text-stone">
                  <th scope="col" className="py-3 pr-4 font-medium">Received</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Client</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Project</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Budget</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-line align-top transition-colors hover:bg-linen/60">
                    <td className="whitespace-nowrap py-4 pr-4 text-stone">{fmtDate(item.createdAt)}</td>
                    <td className="py-4 pr-4">
                      <span className="block font-medium">{item.name}</span>
                      <span className="block text-stone">{item.email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="block">{item.projectType}</span>
                      <span className="block text-stone">{item.location}</span>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4">{item.budget}</td>
                    <td className="py-4 pr-4">
                      <StatusSelect
                        id={`status-${item.id}`}
                        label={`Status for ${item.name}`}
                        value={item.status}
                        disabled={savingId === item.id}
                        onChange={(s) => changeStatus(item, s)}
                      />
                    </td>
                    <td className="py-4 text-right">
                      <button type="button" onClick={() => setSelected(item)} className="link-u whitespace-nowrap">
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {items.map((item) => (
                <li key={item.id} className="border border-line p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-stone">{fmtDate(item.createdAt)}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-sm">
                    {item.projectType} · {item.location}
                  </p>
                  <p className="text-sm text-stone">{item.budget}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <StatusSelect
                      id={`m-status-${item.id}`}
                      label={`Status for ${item.name}`}
                      value={item.status}
                      disabled={savingId === item.id}
                      onChange={(s) => changeStatus(item, s)}
                    />
                    <button type="button" onClick={() => setSelected(item)} className="link-u text-sm">
                      View details
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {pagination.pages > 1 && (
              <nav aria-label="Pagination" className="mt-8 flex items-center justify-between text-sm">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-line px-4 py-2 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-stone">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-line px-4 py-2 disabled:opacity-40"
                >
                  Next →
                </button>
              </nav>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <DetailPanel
            key={selected.id}
            item={selected}
            onClose={closeDetail}
            onStatus={changeStatus}
            saving={savingId === selected.id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-charcoal px-5 py-3 text-sm text-bone shadow-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
