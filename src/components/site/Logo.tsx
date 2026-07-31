export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-ink-foreground ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M9 8h6" />
        <path d="M9 12h4" />
      </svg>
    </span>
  );
}
