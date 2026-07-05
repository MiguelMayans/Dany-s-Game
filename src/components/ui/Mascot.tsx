export type MascotMood = 'idle' | 'happy' | 'sad' | 'celebrate';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: MascotMood;
  className?: string;
}

const sizeStyles: Record<Required<MascotProps>['size'], string> = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-9xl',
};

const moodConfig: Record<MascotMood, { anim: string; accessory: string; label: string }> = {
  idle: { anim: 'animate-bounce-gentle', accessory: '', label: 'Toto el oso' },
  happy: { anim: 'animate-bounce-gentle', accessory: '✨', label: 'Toto contento' },
  sad: { anim: 'animate-toto-sad', accessory: '💧', label: 'Toto sorprendido' },
  celebrate: { anim: 'animate-toto-celebrate', accessory: '🎉', label: 'Toto celebrando' },
};

export default function Mascot({ size = 'lg', mood = 'idle', className = '' }: MascotProps) {
  const { anim, accessory, label } = moodConfig[mood];

  return (
    <span
      className={['relative inline-block select-none drop-shadow-md', sizeStyles[size], anim, className].join(' ')}
      role="img"
      aria-label={label}
    >
      🐻
      {accessory && (
        <span
          className="absolute -right-2 -top-1 text-[0.4em] animate-bounce-gentle"
          aria-hidden="true"
        >
          {accessory}
        </span>
      )}
    </span>
  );
}
