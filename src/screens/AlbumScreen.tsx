import { useState } from 'react';
import { WORDS } from '../data/words';
import type { Progress, Settings } from '../game/storage';
import { speakWord } from '../audio/speech';
import { unlockAudio } from '../audio/sounds';
import SoundToggles from '../components/SoundToggles';
import Stars from '../components/Stars';
import Sticker from '../components/Sticker';
import { HomeIcon } from '../components/icons';

interface Props {
  progress: Progress;
  settings: Settings;
  onSettings: (s: Settings) => void;
  onHome: () => void;
}

export default function AlbumScreen({ progress, settings, onSettings, onHome }: Props) {
  const [tapped, setTapped] = useState<{ text: string; n: number } | null>(null);
  const collected = Object.keys(progress.stickers).length;

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-10">
      <header className="sticky top-0 z-10 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between gap-3 bg-sky/85 px-[max(16px,2vw)] py-3 backdrop-blur">
        <button type="button" className="toy-btn size-11 sm:size-12" onClick={onHome} aria-label="Volver al inicio">
          <HomeIcon />
        </button>
        <h1 className="text-center text-[min(7vw,34px)] font-bold leading-none">
          Mi álbum{' '}
          <span className="ml-1 rounded-full bg-sun px-3 text-[0.75em]">
            {collected}/{WORDS.length}
          </span>
        </h1>
        <SoundToggles settings={settings} onChange={onSettings} />
      </header>

      {collected === 0 && (
        <p className="mt-6 max-w-md text-center text-xl font-medium">
          Cada palabra que escribas te da su pegatina. ¡Juega para llenar el álbum!
        </p>
      )}

      <ul className="mt-4 grid w-full max-w-5xl grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-3 gap-y-3">
        {WORDS.map((w, i) => {
          const stars = progress.stickers[w.text];
          const has = stars !== undefined;
          const tilt = [-3, 2, -1, 3, -2][i % 5];
          return (
            <li key={w.text} className="flex flex-col items-center gap-1">
              {has ? (
                <button
                  // Remount on each tap so the wiggle replays.
                  key={tapped?.text === w.text ? tapped.n : 0}
                  type="button"
                  className={`rounded-[28%] ${tapped?.text === w.text ? 'anim-wiggle' : ''}`}
                  onClick={() => {
                    unlockAudio();
                    speakWord(w.text);
                    setTapped(t => ({ text: w.text, n: (t?.n ?? 0) + 1 }));
                  }}
                  aria-label={`${w.text}, ${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`}
                >
                  <Sticker word={w} size="88px" tilt={tilt} />
                </button>
              ) : (
                <Sticker word={w} size="88px" missing />
              )}
              <span className={`text-base font-semibold ${has ? '' : 'opacity-0'}`} aria-hidden={!has}>
                {w.text}
              </span>
              {has ? <Stars count={stars} size={18} /> : <span className="h-[18px]" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
