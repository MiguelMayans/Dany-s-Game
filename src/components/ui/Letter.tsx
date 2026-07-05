import type { ReactNode } from 'react';

interface LetterProps {
  char: string;
  state?: 'default' | 'correct' | 'wrong' | 'pop';
  isActive?: boolean;
  children?: ReactNode;
}

export default function Letter({ char, state = 'default', isActive = false, children }: LetterProps) {
  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'min-w-[clamp(48px,9vw,120px)] h-[clamp(72px,14vw,140px)]',
    'px-3 rounded-[22px] text-[clamp(24px,5.5vw,60px)] font-display font-extrabold',
    'cartoon-border transition-all duration-150 will-change-transform',
  ];

  const stateClasses: Record<typeof state, string> = {
    default:
      'bg-[#eef2ff] text-dan-border shadow-[0_6px_0_var(--color-dan-border),0_14px_28px_rgba(0,0,0,0.16)]',
    correct:
      'bg-dan-success text-dan-success-text shadow-[0_2px_0_var(--color-dan-border),0_6px_10px_rgba(0,0,0,0.1)] translate-y-1',
    wrong:
      'bg-dan-wrong text-dan-wrong-text animate-shake',
    pop: 'bg-dan-success text-dan-success-text animate-pop',
  };

  const showActive = isActive && state === 'default';

  return (
    <span className={[...baseClasses, stateClasses[state], showActive ? 'animate-active-pulse' : ''].join(' ')}>
      {showActive && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl animate-bounce-gentle"
          aria-hidden="true"
        >
          ▼
        </span>
      )}
      {char.toUpperCase()}
      {children}
    </span>
  );
}
