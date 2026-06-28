import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

const paddingStyles: Record<Required<CardProps>['padding'], string> = {
  sm: 'p-6 pt-10',
  md: 'p-8 pt-12',
  lg: 'p-10 pt-14',
};

const maxWidthStyles: Record<Required<CardProps>['maxWidth'], string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
  '3xl': 'max-w-7xl',
  '4xl': 'max-w-[1400px]',
  full: 'max-w-none',
};

export default function Card({
  children,
  className = '',
  padding = 'lg',
  maxWidth = 'lg',
}: CardProps) {
  return (
    <div
      className={[
        'relative w-full rounded-[32px] bg-dan-card card-dots',
        'border-[5px] border-dan-border cartoon-shadow-lg',
        paddingStyles[padding],
        maxWidthStyles[maxWidth],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
