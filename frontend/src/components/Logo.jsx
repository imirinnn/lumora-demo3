import { Link } from 'react-router-dom';

export default function Logo({ className = '', onClick }) {
  return (
    <Link to="/" onClick={onClick} className={`group inline-flex items-baseline gap-2 ${className}`} aria-label="Lumora Interiors — home">
      <span className="font-display text-[1.65rem] font-normal leading-none tracking-[0.32em]">LUMORA</span>
      <span className="hidden text-[0.55rem] font-medium uppercase tracking-[0.3em] opacity-60 transition-opacity duration-500 group-hover:opacity-100 xl:inline">
        Interiors
      </span>
    </Link>
  );
}
