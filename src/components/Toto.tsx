export type TotoMood = 'idle' | 'happy' | 'oops' | 'party';

interface Props {
  mood?: TotoMood;
  size?: number | string;
  className?: string;
}

const INK = '#26315c';

const LABELS: Record<TotoMood, string> = {
  idle: 'Toto, el osito',
  happy: 'Toto contento',
  oops: 'Toto sorprendido',
  party: 'Toto celebrando',
};

function Eyes({ mood }: { mood: TotoMood }) {
  if (mood === 'party' || mood === 'happy') {
    return (
      <g fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round">
        <path d="M36 58 Q43 49 50 58" />
        <path d="M70 58 Q77 49 84 58" />
      </g>
    );
  }
  const r = mood === 'oops' ? 7 : 5.5;
  return (
    <g>
      <circle cx="43" cy="56" r={r} fill={INK} />
      <circle cx="77" cy="56" r={r} fill={INK} />
      <circle cx="45" cy="53.5" r="1.8" fill="#fff" />
      <circle cx="79" cy="53.5" r="1.8" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }: { mood: TotoMood }) {
  switch (mood) {
    case 'oops':
      return <ellipse cx="60" cy="88" rx="4.5" ry="5.5" fill={INK} />;
    case 'happy':
    case 'party':
      return (
        <path
          d="M49 83 Q60 99 71 83 Z"
          fill="#e8505b"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      );
    default:
      return (
        <path d="M52 84 Q60 91 68 84" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      );
  }
}

/** Toto, the teddy bear who keeps Dani company. Changes face with `mood`. */
export default function Toto({ mood = 'idle', size = 96, className = '' }: Props) {
  return (
    <svg
      // Remount on mood change so one-shot animations replay every time.
      key={mood}
      viewBox="0 0 120 120"
      style={{ width: size, height: size }}
      role="img"
      aria-label={LABELS[mood]}
      className={`toto mood-${mood} ${className}`}
    >
      <g stroke={INK} strokeWidth="4.5">
        <circle cx="27" cy="30" r="17" fill="#c98b55" />
        <circle cx="93" cy="30" r="17" fill="#c98b55" />
      </g>
      <circle cx="27" cy="30" r="8" fill="#f2c29b" />
      <circle cx="93" cy="30" r="8" fill="#f2c29b" />
      <circle cx="60" cy="64" r="44" fill="#d9a06b" stroke={INK} strokeWidth="4.5" />
      <circle cx="33" cy="74" r="7" fill="#f28b8b" opacity="0.55" />
      <circle cx="87" cy="74" r="7" fill="#f28b8b" opacity="0.55" />
      <ellipse cx="60" cy="81" rx="21" ry="16" fill="#f6d9b5" stroke={INK} strokeWidth="3.5" />
      <ellipse cx="60" cy="73" rx="7.5" ry="5.5" fill={INK} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
    </svg>
  );
}
