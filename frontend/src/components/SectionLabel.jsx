/** Small numbered label used to open sections, e.g. "(02) — Selected Work". */
export default function SectionLabel({ number, children, className = '' }) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`}>
      {number && <span className="font-display text-base normal-case tracking-normal italic opacity-70">({number})</span>}
      <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
