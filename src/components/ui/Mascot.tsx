interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeStyles: Record<Required<MascotProps>['size'], string> = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-9xl',
};

export default function Mascot({ size = 'lg', animate = true, className = '' }: MascotProps) {
  return (
    <span
      className={[
        'inline-block select-none drop-shadow-md',
        sizeStyles[size],
        animate ? 'animate-bounce-gentle' : '',
        className,
      ].join(' ')}
      role="img"
      aria-label="Toto el oso"
    >
      🐻
    </span>
  );
}
