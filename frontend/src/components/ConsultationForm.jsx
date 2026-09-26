import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Arrow } from './Button';
import { submitConsultation } from '../services/consultations';
import { BUDGETS, PROJECT_TYPES } from '../data/content';
import { EASE } from '../animations/motion';

const EMPTY = { name: '', email: '', phone: '', projectType: '', location: '', budget: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{8,20}$/;
const MESSAGE_MAX = 2000;

/** Mirrors the server-side rules so visitors get instant, friendly feedback. */
function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  const digits = v.phone.replace(/\D/g, '');
  if (!PHONE_RE.test(v.phone.trim()) || digits.length < 8 || digits.length > 15) e.phone = 'Please enter a valid phone number.';
  if (v.location.trim().length < 2) e.location = 'Please tell us where the project is.';
  if (!v.projectType) e.projectType = 'Please choose a project type.';
  if (!v.budget) e.budget = 'Please choose an approximate budget.';
  if (v.message.trim().length < 10) e.message = 'Please share a little more about your project (10+ characters).';
  if (v.message.length > MESSAGE_MAX) e.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
  return e;
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="meta-label block">
        {label}
      </label>
      {children}
      <div className="min-h-[1.5rem] pt-2 text-xs">
        {error ? (
          <p id={`${id}-error`} className="text-[#9b3b2e]">
            {error}
          </p>
        ) : (
          hint && <p className="text-stone">{hint}</p>
        )}
      </div>
    </div>
  );
}

function PillGroup({ name, legend, options, value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined} aria-invalid={!!error}>
      <legend className="meta-label mb-4">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`;
          return (
            <span key={opt}>
              <input
                type="radio"
                id={id}
                name={name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(name, opt)}
                className="sr-only"
              />
              <label htmlFor={id} className="pill">
                {opt}
              </label>
            </span>
          );
        })}
      </div>
      <div className="min-h-[1.5rem] pt-2 text-xs">
        {error && (
          <p id={`${name}-error`} className="text-[#9b3b2e]">
            {error}
          </p>
        )}
      </div>
    </fieldset>
  );
}

export default function ConsultationForm() {
  const reduce = useReducedMotion();
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  const set = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    // Re-validate a field live once the visitor has interacted with it
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
    if (name === 'projectType' || name === 'budget') setTouched((t) => ({ ...t, [name]: true }));
  };

  const onChange = (e) => set(e.target.name, e.target.value);
  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  };

  const focusFirstError = (errs) => {
    const order = ['name', 'email', 'phone', 'location', 'projectType', 'budget', 'message'];
    const first = order.find((k) => errs[k]);
    if (!first) return;
    const el = formRef.current?.querySelector(`[name="${first}"]`);
    el?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }

    setStatus('submitting');
    setServerError('');
    try {
      await submitConsultation({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        projectType: values.projectType,
        location: values.location.trim(),
        budget: values.budget,
        message: values.message.trim(),
        website: values.website, // honeypot
      });
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      setStatus('error');
      if (err.errors) {
        setErrors(err.errors);
        focusFirstError(err.errors);
      }
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const inputProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: 'field-input',
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            role="status"
            className="flex min-h-[32rem] flex-col items-start justify-center"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-umber" aria-hidden="true">
              <motion.circle
                cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1"
                initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE }}
              />
              <motion.path
                d="M20 33l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="1.5"
                initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
              />
            </svg>
            <h2 className="display-lg mt-10">Thank you.</h2>
            <p className="lead mt-6 max-w-md text-stone">
              Our design team will be in touch shortly — usually within one working day.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="link-u eyebrow mt-10 text-charcoal"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-label="Consultation enquiry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <Field id="name" label="Name *" error={errors.name}>
                <input type="text" autoComplete="name" placeholder="Your full name" {...inputProps('name')} />
              </Field>
              <Field id="email" label="Email *" error={errors.email}>
                <input type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" {...inputProps('email')} />
              </Field>
              <Field id="phone" label="Phone *" error={errors.phone}>
                <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" {...inputProps('phone')} />
              </Field>
              <Field id="location" label="Project location *" error={errors.location}>
                <input type="text" autoComplete="address-level2" placeholder="City or neighbourhood" {...inputProps('location')} />
              </Field>
            </div>

            <div className="mt-6 grid gap-6">
              <PillGroup name="projectType" legend="Project type *" options={PROJECT_TYPES} value={values.projectType} onChange={set} error={errors.projectType} />
              <PillGroup name="budget" legend="Approximate budget *" options={BUDGETS} value={values.budget} onChange={set} error={errors.budget} />
            </div>

            <div className="mt-4">
              <Field
                id="message"
                label="Tell us about your space *"
                error={errors.message}
                hint={`${values.message.length} / ${MESSAGE_MAX}`}
              >
                <textarea
                  rows={5}
                  maxLength={MESSAGE_MAX}
                  placeholder="The size of the space, what you love, what isn’t working, your timeline…"
                  {...inputProps('message')}
                />
              </Field>
            </div>

            {/* Honeypot — hidden from people and assistive tech; bots tend to fill it */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
            </div>

            <AnimatePresence>
              {status === 'error' && serverError && (
                <motion.p
                  role="alert"
                  className="mt-6 border-l-2 border-[#9b3b2e] bg-[#9b3b2e]/5 px-4 py-3 text-sm text-[#7d2f25]"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs text-stone">
                We’ll only use your details to reply to this enquiry. No newsletters, ever.
              </p>
              <button type="submit" className="btn btn-dark min-w-[12rem]" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-bone/30 border-t-bone" aria-hidden="true" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <Arrow />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
