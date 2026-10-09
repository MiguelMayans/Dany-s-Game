import { StarIcon } from './icons';

interface Props {
  count: number;
  size?: number;
  /** Pop the stars in one after another. */
  animate?: boolean;
  className?: string;
}

export default function Stars({ count, size = 28, animate = false, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      role="img"
      aria-label={`${count} ${count === 1 ? 'estrella' : 'estrellas'} de 3`}
    >
      {[0, 1, 2].map(i => (
        <StarIcon
          key={i}
          size={size}
          filled={i < count}
          className={animate ? 'anim-pop-in' : undefined}
          style={animate ? { animationDelay: `${150 + i * 140}ms` } : undefined}
        />
      ))}
    </span>
  );
}
