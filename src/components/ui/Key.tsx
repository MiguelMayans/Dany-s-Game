interface KeyProps {
  letter: string;
  onPress: (letter: string) => void;
  colorIndex?: number;
  hint?: boolean;
}

const keyColors = [
  'bg-key-yellow',
  'bg-key-orange',
  'bg-key-coral',
  'bg-key-purple',
  'bg-key-cyan',
  'bg-key-green',
  'bg-key-blue',
];

export default function Key({ letter, onPress, colorIndex = 0, hint = false }: KeyProps) {
  const colorClass = keyColors[colorIndex % keyColors.length];

  return (
    <button
      type="button"
      onClick={() => onPress(letter)}
      aria-label={`Letra ${letter}`}
      className={[
        'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] xl:w-20 xl:h-20',
        'rounded-2xl text-xl sm:text-2xl font-display font-extrabold uppercase',
        'cartoon-border cartoon-shadow-sm press-effect',
        'flex items-center justify-center text-dan-border',
        'hover:-translate-y-1 hover:scale-105 hover:brightness-105',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dan-blue/50',
        colorClass,
        hint ? 'animate-hint-pulse z-10' : '',
      ].join(' ')}
    >
      {letter}
    </button>
  );
}
