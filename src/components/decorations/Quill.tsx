interface QuillProps {
  className?: string;
  animated?: boolean;
}

export function Quill({ className = '', animated = false }: QuillProps) {
  return (
    <svg
      className={`w-6 h-6 ${animated ? 'animate-quill-write' : ''} ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M21 2 C21 2 19 4 17 6 C15 8 13 11 12 14 C11.5 15.5 11 17 11 18 L10 22 L9 18 C9 17 8.5 15.5 8 14 C7 11 5 8 3 6 C1 4 -1 2 -1 2 C3 3 7 5 10 8 C10.5 8.5 11 9 11.5 9.5 L12 10 L12.5 9.5 C13 9 13.5 8.5 14 8 C17 5 21 3 25 2 L21 2 Z" />
      <path d="M10 22 L10 18 L11 18 L11 22 Z" fill="var(--ink-brown)" />
    </svg>
  );
}
