import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessJingle } from '../utils/sounds';
import { speakPhrase } from '../utils/speech';
import { ACHIEVEMENTS } from '../types/game';

interface Props {
  success: boolean;
  streak: number;
  bestStreak: number;
  totalWords: number;
  newAchievements: string[];
}

const CONFETTI_COLORS = ['#ffd166', '#ff6b6b', '#06d6a0', '#4cc9f0', '#ff4757'];

const SUCCESS_MESSAGES = [
  '¡Muy bien Dani!',
  '¡Campeón!',
  '¡Genial Dani!',
  '¡Increíble!',
  '¡Eres un crack, Dani!',
];

export default function Feedback({ success, streak, bestStreak, totalWords, newAchievements }: Props) {
  const message = SUCCESS_MESSAGES[(totalWords + streak) % SUCCESS_MESSAGES.length];

  useEffect(() => {
    if (!success) return;

    playSuccessJingle();
    speakPhrase(message);

    try {
      confetti({
        particleCount: 200,
        spread: 180,
        startVelocity: 45,
        ticks: 250,
        origin: { x: 0.5, y: 0.5 },
        colors: CONFETTI_COLORS,
      });
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.2, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 100);
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          startVelocity: 35,
          origin: { x: 0.8, y: 0.3 },
          colors: CONFETTI_COLORS,
        });
      }, 150);
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 90,
          startVelocity: 40,
          origin: { x: 0.5, y: 0 },
          colors: CONFETTI_COLORS,
        });
      }, 200);
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 160,
          startVelocity: 20,
          origin: { x: 0.5, y: 0.7 },
          colors: CONFETTI_COLORS,
        });
      }, 350);
    } catch {
      // ignore
    }
  }, [success, message]);

  if (!success) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      aria-live="polite"
    >
      <div className="animate-banner-pop rounded-[26px] border-[10px] border-dan-border bg-linear-135 from-dan-yellow via-dan-coral to-dan-cyan p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="text-3xl sm:text-5xl font-black text-shadow-soft">
          {message} <span className="inline-block animate-bounce-gentle">🐻</span>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-base sm:text-xl font-bold">
          <span className="rounded-xl bg-black/15 px-4 py-1">Racha: {streak}</span>
          <span className="rounded-xl bg-black/15 px-4 py-1">Mejor: {bestStreak}</span>
          <span className="rounded-xl bg-black/15 px-4 py-1">Hoy: {totalWords}</span>
        </div>

        {newAchievements.length > 0 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            {newAchievements.map(id => {
              const achievement = ACHIEVEMENTS.find(a => a.id === id);
              if (!achievement) return null;
              return (
                <div
                  key={id}
                  className="animate-badge-pop rounded-2xl border-4 border-dan-border bg-white px-5 py-2 text-lg sm:text-xl font-black text-dan-coral"
                >
                  {achievement.emoji} ¡{achievement.name}!
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
