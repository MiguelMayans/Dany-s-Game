interface Props {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

export default function MuteButton({ muted, onToggle, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      aria-pressed={muted}
      className={[
        'flex h-11 w-11 items-center justify-center rounded-2xl border-[4px] border-dan-border',
        'bg-dan-card text-xl shadow-[0_4px_0_var(--color-dan-border)] press-effect',
        className,
      ].join(' ')}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
