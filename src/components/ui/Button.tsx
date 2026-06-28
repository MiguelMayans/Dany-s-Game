import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'yellow' | 'blue' | 'green' | 'coral';
  size?: 'md' | 'lg' | 'xl';
}

const variantStyles: Record<Required<ButtonProps>['variant'], string> = {
  yellow: 'bg-linear-135 from-dan-yellow to-dan-orange text-white',
  blue: 'bg-linear-135 from-dan-cyan to-dan-blue text-white',
  green: 'bg-linear-135 from-dan-green to-dan-cyan text-white',
  coral: 'bg-linear-135 from-dan-coral to-dan-pink text-white',
};

const sizeStyles: Record<Required<ButtonProps>['size'], string> = {
  md: 'px-6 py-3 text-xl rounded-2xl border-[4px]',
  lg: 'px-8 py-4 text-2xl rounded-3xl border-[5px]',
  xl: 'px-10 py-6 text-3xl rounded-3xl border-[5px]',
};

export default function Button({
  children,
  variant = 'yellow',
  size = 'lg',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        'font-display font-extrabold tracking-wide',
        'cartoon-border cartoon-shadow press-effect',
        'flex flex-col items-center justify-center gap-1',
        'hover:-translate-y-1 hover:scale-103 hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dan-blue/50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
