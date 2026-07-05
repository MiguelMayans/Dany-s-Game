import { useEffect, useState } from 'react';
import OnScreenKeyboard from './OnScreenKeyboard';
import Feedback from './Feedback';
import ProgressBar from './ProgressBar';
import StartScreen from './StartScreen';
import VictoryScreen from './VictoryScreen';
import { useGame } from '../hooks/useGame';
import { findWordEntry } from '../utils/gameHelpers';
import { markUserInteraction, setMuted } from '../utils/sounds';
import { speakWord } from '../utils/speech';
import Card from './ui/Card';
import Letter from './ui/Letter';
import Button from './ui/Button';
import Mascot from './ui/Mascot';
import type { MascotMood } from './ui/Mascot';

const MUTE_KEY = 'dan-game-muted';

export default function Game() {
  const { state, startLevel, handleKeyPress, goMenu } = useGame();

  const [muted, setMutedState] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setMuted(muted);
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      // ignore
    }
  }, [muted]);

  const toggleMute = () => setMutedState(m => !m);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (/^[a-zñ]$/.test(k)) {
        markUserInteraction();
        handleKeyPress(k);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKeyPress]);

  if (state.screen === 'menu') {
    return (
      <StartScreen
        onStartLevel1={() => {
          markUserInteraction();
          startLevel('level1');
        }}
        onStartLevel2={() => {
          markUserInteraction();
          startLevel('level2');
        }}
        bestStreak={state.bestStreak}
        totalWords={state.totalWordsToday}
        achievements={Array.from(state.achievements)}
      />
    );
  }

  if (state.screen === 'victory') {
    return (
      <VictoryScreen
        streak={state.streak}
        bestStreak={state.bestStreak}
        totalWords={state.totalWordsToday}
        newAchievements={state.newAchievements}
        onGoMenu={goMenu}
      />
    );
  }

  const entry = findWordEntry(state.word);
  const hintLetter =
    state.wrongCount >= 3 && state.pos < state.word.length ? state.word[state.pos] : null;

  const totoMood: MascotMood = state.success
    ? 'celebrate'
    : state.wrong
      ? 'sad'
      : state.poppedIndex !== null
        ? 'happy'
        : 'idle';

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
      <Card padding="sm" maxWidth="4xl" className="flex w-[96vw] flex-col items-center gap-3 sm:gap-4">
        {/* Header */}
        <div className="flex w-full items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-dan-border bg-linear-135 from-dan-yellow to-dan-orange px-4 py-2 text-sm sm:text-base font-extrabold text-white text-shadow-soft shadow-[0_4px_0_var(--color-dan-border)]">
            <Mascot size="sm" mood={totoMood} />
            <span>Palabras con TOTO</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
              aria-pressed={muted}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-[4px] border-dan-border bg-dan-card text-xl shadow-[0_4px_0_var(--color-dan-border)] press-effect"
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <Button variant="coral" size="md" onClick={goMenu} className="!px-4 !py-2 !text-base">
              Menú
            </Button>
          </div>
        </div>

        <Feedback
          success={state.success}
          streak={state.streak}
          bestStreak={state.bestStreak}
          totalWords={state.totalWordsToday}
          newAchievements={state.newAchievements}
        />

        <ProgressBar current={state.currentIndex} total={state.levelWords.length} />

        {/* Word image */}
        {entry?.img ? (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-[28px] bg-linear-135 from-dan-yellow via-dan-coral to-dan-cyan p-1.5 shadow-lg">
              <img
                src={entry.img}
                alt={entry.word}
                className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-[24px] bg-white p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => speakWord(state.word)}
              className="rounded-full border-[4px] border-dan-border bg-dan-cyan px-4 py-1.5 text-sm font-extrabold text-white shadow-[0_4px_0_var(--color-dan-border)] press-effect"
              aria-label="Escuchar la palabra"
            >
              🔊 Escuchar
            </button>
          </div>
        ) : null}

        {/* Word letters */}
        <div className="relative flex flex-wrap justify-center gap-2 sm:gap-3">
          {state.wrong && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
              <div className="animate-bubble-pop relative whitespace-nowrap rounded-full border-[4px] border-dan-border bg-dan-coral px-5 py-2 text-base sm:text-lg font-extrabold text-white shadow-[0_4px_0_var(--color-dan-border)]">
                <span className="mr-1" aria-hidden="true">{state.wrongEmoji}</span>{state.wrongMessage}
                <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 h-0 w-0 border-x-[11px] border-t-[12px] border-x-transparent border-t-[var(--color-dan-border)]" aria-hidden="true" />
                <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 h-0 w-0 border-x-[8px] border-t-[9px] border-x-transparent border-t-[var(--color-dan-coral)]" aria-hidden="true" />
              </div>
            </div>
          )}
          {state.word.split('').map((ch, i) => {
            const isCorrect = i < state.pos;
            const isCurrentWrong = i === state.pos && state.wrong;
            const isPopped = state.poppedIndex === i;

            let letterState: 'default' | 'correct' | 'wrong' | 'pop' = 'default';
            if (isPopped) letterState = 'pop';
            else if (isCurrentWrong) letterState = 'wrong';
            else if (isCorrect) letterState = 'correct';

            const isActive = i === state.pos && !state.wrong && !isPopped && !state.success;

            return (
              <Letter
                key={i}
                char={ch}
                state={letterState}
                isActive={isActive}
              >
                {state.sparks
                  .filter(s => s.letterIndex === i)
                  .map(s => (
                    <span
                      key={s.id}
                      className="spark"
                      style={{ '--dx': `${s.offset}px` } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      ✨
                    </span>
                  ))}
              </Letter>
            );
          })}
        </div>

        {/* On-screen keyboard */}
        <OnScreenKeyboard
          onKeyPress={k => {
            markUserInteraction();
            handleKeyPress(k);
          }}
          hintLetter={hintLetter}
        />

        <p className="text-center text-sm font-bold text-dan-muted">
          Pulsa las letras del teclado o usa el teclado del ordenador.
        </p>
      </Card>
    </div>
  );
}
