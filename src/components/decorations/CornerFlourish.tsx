interface CornerFlourishProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function CornerFlourish({ position, className = '' }: CornerFlourishProps) {
  const rotations = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  };

  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  return (
    <svg
      className={`absolute w-8 h-8 ${positions[position]} ${rotations[position]} ${className}`}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M2 2 C2 2 8 2 12 6 C16 10 16 16 16 16 C16 16 10 16 6 12 C2 8 2 2 2 2 M6 6 C6 8 8 10 10 10 C8 10 6 8 6 6" />
      <path d="M2 6 Q4 10 8 10 Q4 10 2 6" opacity="0.5" />
    </svg>
  );
}
