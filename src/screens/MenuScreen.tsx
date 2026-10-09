import type { CSSProperties } from 'react';
import { LEVELS, type LevelId } from '../data/levels';
import { WORDS } from '../data/words';
import type { Progress, Settings } from '../game/storage';
import SoundToggles from '../components/SoundToggles';
import Toto from '../components/Toto';
import { AlbumIcon } from '../components/icons';

interface Props {
  progress: Progress;
  settings: Settings;
  onSettings: (s: Settings) => void;
  onStart: (id: LevelId) => void;
  onAlbum: () => void;
}

const TITLE = [
  { ch: 'T', face: 'var(--color-berry)', fg: '#fff' },
  { ch: 'O', face: 'var(--color-sun)', fg: 'var(--color-ink)' },
  { ch: 'T', face: 'var(--color-sea)', fg: '#fff' },
  { ch: 'O', face: 'var(--color-leaf)', fg: '#fff' },
];

export default function MenuScreen({ progress, settings, onSettings, onStart, onAlbum }: Props) {
  const collected = Object.keys(progress.stickers).length;

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-6">
      <header className="flex w-full max-w-4xl justify-end pt-3">
        <SoundToggles settings={settings} onChange={onSettings} />
      </header>

      <div className="anim-rise-in flex flex-col items-center gap-2 pt-1 sm:flex-row sm:gap-6">
        <Toto mood="idle" size="min(22dvh, 34vw, 170px)" />
        <h1 className="flex flex-col items-center gap-2 sm:items-start">
          <span className="text-[min(7vw,34px)] font-semibold leading-none">¡Hola, Dani! Palabras con</span>
          <span className="flex gap-2" aria-label="Toto">
            {TITLE.map((t, i) => (
              <span
                key={i}
                className="tblock"
                style={{ '--s': 'min(15vw, 76px)', '--face': t.face, rotate: `${[-4, 3, -2, 5][i]}deg` } as CSSProperties}
                aria-hidden="true"
              >
                <span className="tblock-face" style={{ color: t.fg }}>
                  {t.ch}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </div>

      <nav
        className="mt-[4dvh] grid w-full max-w-3xl grid-cols-1 gap-4 min-[520px]:grid-cols-2"
        aria-label="Elige un juego"
      >
        {LEVELS.map((level, i) => {
          const samples = [0, Math.floor(level.words.length / 2), level.words.length - 1].map(
            j => level.words[j],
          );
          const got = level.words.filter(w => progress.stickers[w.text] !== undefined).length;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onStart(level.id)}
              className="toy-btn anim-rise-in relative flex-col! items-stretch! gap-3! rounded-[28px]! p-4 text-left [--depth:7px]"
              style={{ background: level.color, animationDelay: `${80 + i * 60}ms` }}
            >
              <span className="flex items-center gap-2">
                {samples.map((w, k) => (
                  <span
                    key={w.text}
                    className="grid size-[min(16vw,64px)] place-items-center rounded-2xl border-[3px] border-white text-[min(9vw,38px)] shadow-[0_2px_0_rgb(38_49_92/0.25)]"
                    style={{ background: w.color, rotate: `${[-5, 2, 6][k]}deg` }}
                    aria-hidden="true"
                  >
                    {level.hidden ? '?' : w.emoji}
                  </span>
                ))}
                <span
                  className="ml-auto grid size-9 place-items-center rounded-xl border-[3px] border-ink bg-white text-lg font-bold"
                  title={`Tecla ${i + 1}`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              </span>
              <span className="flex items-end justify-between gap-2">
                <span>
                  <span className="block text-[min(8vw,34px)] font-bold leading-none">{level.name}</span>
                  <span className="mt-1 block text-base font-medium opacity-80">{level.hint}</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span className="flex gap-1" aria-label={`Dificultad ${level.difficulty} de 3`}>
                    {[1, 2, 3].map(d => (
                      <span
                        key={d}
                        className={`size-3.5 rounded-[4px] border-2 border-ink ${d <= level.difficulty ? 'bg-ink' : 'bg-white/60'}`}
                      />
                    ))}
                  </span>
                  <span className="text-sm font-semibold opacity-80">
                    {got}/{level.words.length}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onAlbum}
        className="toy-btn anim-rise-in mt-5 px-6 py-3 text-2xl [animation-delay:340ms]"
      >
        <AlbumIcon size={32} />
        Mi álbum
        <span className="rounded-full bg-sun px-3 text-xl">
          {collected}/{WORDS.length}
        </span>
      </button>

      <footer className="mt-auto pt-8 text-center text-sm font-medium text-ink-soft">
        <p>
          Hoy: {progress.today} {progress.today === 1 ? 'palabra' : 'palabras'}.
          Teclas 1 a 4 para empezar, Espacio repite la palabra y Esc vuelve aquí.
        </p>
      </footer>
    </div>
  );
}
