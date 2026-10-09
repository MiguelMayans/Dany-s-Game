import type { CSSProperties } from 'react';
import type { Word } from '../data/words';

interface Props {
  word: Word;
  size: string;
  missing?: boolean;
  tilt?: number;
  className?: string;
}

/** A die-cut sticker with the word's picture. */
export default function Sticker({ word, size, missing = false, tilt = 0, className = '' }: Props) {
  return (
    <span
      className={`sticker ${missing ? 'is-missing' : ''} ${className}`}
      style={{ '--s': size, '--tilt': `${tilt}deg`, rotate: `${tilt}deg`, background: word.color } as CSSProperties}
      aria-hidden="true"
    >
      <span>{word.emoji}</span>
    </span>
  );
}
