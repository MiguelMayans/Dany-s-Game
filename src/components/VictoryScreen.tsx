import { ACHIEVEMENTS } from '../types/game';
import Button from './ui/Button';
import Card from './ui/Card';
import Mascot from './ui/Mascot';

interface Props {
  streak: number;
  bestStreak: number;
  totalWords: number;
  newAchievements: string[];
  onGoMenu: () => void;
}

export default function VictoryScreen({
  streak,
  bestStreak,
  totalWords,
  newAchievements,
  onGoMenu,
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card padding="md" maxWidth="md" className="text-center">
        <div className="mb-4 flex justify-center">
          <Mascot size="xl" mood="celebrate" />
        </div>

        <div className="mb-2 text-8xl leading-none animate-trophy-bounce">🏆</div>

        <h2 className="mb-4 text-3xl font-black text-dan-border">¡Nivel completado!</h2>
        <p className="mb-6 text-2xl font-bold text-dan-coral">¡Eres un campeón, Dani!</p>

        <div className="mb-6 flex flex-wrap justify-center gap-3 text-base font-bold text-dan-muted">
          <span className="rounded-xl bg-dan-yellow/20 px-4 py-2">Racha: {streak}</span>
          <span className="rounded-xl bg-dan-cyan/20 px-4 py-2">Mejor: {bestStreak}</span>
          <span className="rounded-xl bg-dan-green/20 px-4 py-2">Hoy: {totalWords}</span>
        </div>

        {newAchievements.length > 0 && (
          <div className="mb-6 flex flex-col items-center gap-2">
            {newAchievements.map(id => {
              const achievement = ACHIEVEMENTS.find(a => a.id === id);
              if (!achievement) return null;
              return (
                <div
                  key={id}
                  className="animate-badge-pop rounded-2xl border-4 border-dan-border bg-white px-6 py-3 text-xl font-black text-dan-coral shadow-[0_4px_0_var(--color-dan-border)]"
                >
                  {achievement.emoji} ¡{achievement.name}!
                </div>
              );
            })}
          </div>
        )}

        <Button variant="green" size="xl" onClick={onGoMenu} className="w-full">
          Volver al menú
        </Button>
      </Card>
    </div>
  );
}
