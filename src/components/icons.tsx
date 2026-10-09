import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 26, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M6 9.5V20h12V9.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  );
}

export function MusicIcon({ off, ...props }: IconProps & { off?: boolean }) {
  return (
    <Icon {...props}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
      <circle cx="16.5" cy="16" r="2.5" fill="currentColor" />
      {off && <path d="M3 3l18 18" strokeWidth="2.8" />}
    </Icon>
  );
}

export function SpeakerIcon({ off, ...props }: IconProps & { off?: boolean }) {
  return (
    <Icon {...props}>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" fillOpacity="0.2" />
      {off ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <>
          <path d="M15.5 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      )}
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </Icon>
  );
}

export function AlbumIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4.5h11.5a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.15" />
      <path d="M5 17.5a2 2 0 0 1 2-2h11.5" />
      <path d="m11.5 7.2.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor" strokeWidth="1.2" />
    </Icon>
  );
}

export function StarIcon({ filled = true, size = 28, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <path
        d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
        fill={filled ? 'var(--color-sun)' : 'rgb(255 255 255 / 0.6)'}
        stroke="var(--color-ink)"
        strokeOpacity={filled ? 1 : 0.3}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
