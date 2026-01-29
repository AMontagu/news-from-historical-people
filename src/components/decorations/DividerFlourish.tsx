interface DividerFlourishProps {
  className?: string;
}

export function DividerFlourish({ className = '' }: DividerFlourishProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--ink-brown)] to-[var(--ink-brown)]" />
      <svg
        className="w-6 h-6 text-[var(--ink-brown)]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2 L14 8 L12 6 L10 8 Z M12 22 L14 16 L12 18 L10 16 Z M2 12 L8 14 L6 12 L8 10 Z M22 12 L16 14 L18 12 L16 10 Z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--ink-brown)] to-[var(--ink-brown)]" />
    </div>
  );
}
