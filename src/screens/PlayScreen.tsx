import type { CSSProperties } from 'react';
import { getLevel } from '../data/levels';
import { lettersOf } from '../game/letters';
import { HINT_AFTER, currentWord, expectedKey, type State } from '../game/state';
import type { Settings } from '../game/storage';
import Keyboard from '../components/Keyboard';
import SoundToggles from '../components/SoundToggles';
import Stars from '../components/Stars';
import Sticker from '../components/Sticker';
import Toto, { type TotoMood } from '../components/Toto';
import { HomeIcon, SpeakerIcon } from '../components/icons';

interface Props {
  state: State;
  settings: Settings;
  onSettings: (s: Settings) => void;
  onPress: (key: string) => void;
  onRepeat: () => void;
  onHome: () => void;
  flash: { key: string; n: number } | null;
}

/** Paint colours for finished letters, with a readable letter colour for each. */
const PAINTS = [
  { face: 'var(--color-berry)', fg: '#fff' },
  { face: 'var(--color-sun)', fg: 'var(--color-ink)' },
  { face: 'var(--color-sea)', fg: '#fff' },
  { face: 'var(--color-leaf)', fg: '#fff' },
];

export default function PlayScreen({ state, settings, onSettings, onPress, onRepeat, onHome, flash }: Props) {
  const word = currentWord(state);
  if (!word) return null;

  const level = getLevel(state.levelId);
  const letters = lettersOf(word.text);
  const needsHint = state.missesHere >= HINT_AFTER;
  const hintKey = needsHint ? expectedKey(state) : null;
  const result = state.solved ? state.results[state.results.length - 1] : null;

  const mood: TotoMood = state.solved
    ? 'party'
    : state.missesHere > 0
      ? 'oops'
      : state.pos > 0
        ? 'happy'
        : 'idle';

  const n = letters.length;
  const blockSize = `min(calc((94vw - ${n - 1} * min(1.6vw, 14px)) / ${n}), 15dvh, 108px)`;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between gap-2 px-[max(12px,2vw)] pt-[max(12px,1.5dvh)]">
        <button type="button" className="toy-btn size-11 sm:size-12" onClick={onHome} aria-label="Volver al inicio">
          <HomeIcon />
        </button>

        <ol className="flex min-w-0 items-center gap-[min(1vw,10px)]" aria-label={`Palabra ${state.index + 1} de ${state.round.length}`}>
          {state.round.map((w, i) => {
            const finished = i < state.index || (i === state.index && state.solved);
            const isNow = i === state.index && !state.solved;
            return (
              <li
                key={w.text}
                className={[
                  'grid size-[min(6vw,44px)] place-items-center rounded-full border-[3px] text-[min(3.6vw,24px)] leading-none',
                  finished ? 'anim-pop-in border-ink bg-white' : '',
                  isNow ? 'border-ink bg-sun/60' : '',
                  !finished && !isNow ? 'border-dashed border-ink/30' : '',
                ].join(' ')}
              >
                {finished ? <span aria-hidden="true">{w.emoji}</span> : null}
              </li>
            );
          })}
        </ol>

        <SoundToggles settings={settings} onChange={onSettings} />
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-evenly gap-[2dvh] px-4">
        <div className="relative flex items-end gap-[min(3vw,28px)]">
          <div className="relative">
            <Toto
              key={`${mood}-${state.pos}-${state.missTick}`}
              mood={mood}
              size="min(18dvh, 22vw, 150px)"
            />
            {hintKey && (
              <div
                className="anim-pop-in absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-2xl border-[3px] border-ink bg-white px-4 py-1 text-[min(7dvh,48px)] font-bold leading-tight"
                aria-live="polite"
              >
                <span className="sr-only">Busca la letra </span>
                <span className="font-letter">{hintKey.toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onRepeat}
              className="block rounded-[28%] transition-transform active:scale-95"
              aria-label={`Escuchar la palabra otra vez`}
              title="Escuchar otra vez (Espacio)"
            >
              <Sticker
                key={word.text}
                word={word}
                size="min(27dvh, 42vw, 230px)"
                tilt={-3}
                className="anim-pop-in"
              />
            </button>
            <button
              type="button"
              onClick={onRepeat}
              className="toy-btn absolute -right-3 -bottom-3 size-[min(9dvh,64px)] bg-sea! text-white"
              aria-label="Escuchar la palabra"
              title="Escuchar otra vez (Espacio)"
            >
              <SpeakerIcon size={30} />
            </button>

            {result && (
              <div className="pointer-events-none absolute inset-x-0 -top-14 flex flex-col items-center gap-1 sm:inset-x-auto sm:top-1/2 sm:left-full sm:ml-[min(4vw,36px)] sm:-translate-y-1/2 sm:items-start sm:gap-2">
                <Stars count={result.stars} size={56} animate />
                {result.isNew && (
                  <span className="anim-pop-in -rotate-6 whitespace-nowrap rounded-full border-[3px] border-ink bg-berry px-3 py-0.5 text-lg font-bold text-white [animation-delay:600ms]">
                    ¡Pegatina nueva!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex justify-center gap-[min(1.6vw,14px)] pt-[2dvh]"
          role="img"
          aria-label={level.hidden ? `Palabra secreta, ${state.pos} de ${n} letras` : word.text}
        >
          {letters.map((ch, i) => {
            const done = i < state.pos;
            const current = i === state.pos && !state.solved;
            const paint = PAINTS[i % PAINTS.length];
            const faceState = done
              ? ''
              : level.hidden
                ? current && needsHint
                  ? 'is-peek'
                  : 'is-secret'
                : '';
            return (
              <span
                key={current ? `${word.text}-${i}-${state.missTick}` : `${word.text}-${i}`}
                className={[
                  'tblock',
                  done ? 'is-done' : '',
                  current ? 'is-current' : '',
                  current && state.missesHere > 0 ? 'is-miss' : '',
                  state.solved ? 'is-solved' : '',
                ].join(' ')}
                style={
                  {
                    '--s': blockSize,
                    '--i': i,
                    ...(done ? { '--face': paint.face } : {}),
                  } as CSSProperties
                }
              >
                <span className={`tblock-face ${faceState}`} style={done ? { color: paint.fg } : undefined}>
                  {ch.toUpperCase()}
                </span>
              </span>
            );
          })}
        </div>
      </main>

      <footer className="mt-[1.5dvh] rounded-t-[32px] border-t-[3px] border-ink/15 bg-white/40 px-2 pt-[2.2dvh] pb-[max(2.2dvh,env(safe-area-inset-bottom))]">
        <Keyboard onPress={onPress} hintKey={hintKey} flash={flash} />
      </footer>
    </div>
  );
}
