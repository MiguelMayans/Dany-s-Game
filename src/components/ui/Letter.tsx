import type { ReactNode } from 'react';

interface LetterProps {
  char: string;
  state?: 'default' | 'correct' | 'wrong' | 'pop';
  showWrongEmoji?: boolean;
  children?: ReactNode;
}

export default function Letter({ char, state = 'default', showWrongEmoji = false, children }: LetterProps) {
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

  return (
    <span className={[...baseClasses, stateClasses[state]].join(' ')}>
      {char.toUpperCase()}
      {showWrongEmoji && (
        <span
          className="absolute -top-12 left-1/2 text-4xl animate-emoji-pop"
          aria-hidden="true"
        >
          🙈
        </span>
      )}
      {children}
    </span>
  );
}
