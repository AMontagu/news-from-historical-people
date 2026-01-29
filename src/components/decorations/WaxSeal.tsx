interface WaxSealProps {
  letter?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export function WaxSeal({ letter = 'C', size = 'md', className = '', animated = false }: WaxSealProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div
      className={`
        wax-seal ${sizes[size]}
        flex items-center justify-center
        font-ui font-bold text-[var(--parchment-light)]
        ${animated ? 'animate-stamp' : ''}
        ${className}
      `}
    >
      {letter}
    </div>
  );
}
