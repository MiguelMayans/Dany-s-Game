import Button from './ui/Button';
import Card from './ui/Card';
import Mascot from './ui/Mascot';
import { ACHIEVEMENTS } from '../types/game';

interface Props {
  onStartLevel1: () => void;
  onStartLevel2: () => void;
  bestStreak: number;
  totalWords: number;
  achievements: string[];
}

export default function StartScreen({ onStartLevel1, onStartLevel2, bestStreak, totalWords, achievements }: Props) {
  const earned = ACHIEVEMENTS.filter(a => achievements.includes(a.id));

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card padding="md" maxWidth="md" className="text-center">
        <div className="mb-2 flex flex-col items-center gap-2">
          <Mascot size="xl" />
          <div className="inline-flex items-center justify-center rounded-full border-[5px] border-dan-border bg-linear-135 from-dan-yellow to-dan-coral px-8 py-3 text-2xl font-extrabold text-white text-shadow-soft shadow-[0_6px_0_var(--color-dan-border),0_14px_30px_rgba(255,107,107,0.35)]">
            ¡Palabras con TOTO! 🐻
          </div>
        </div>

        <p className="mb-6 text-2xl font-bold text-dan-border">
          ¡Hola Dani! Elige un nivel:
        </p>

        <div className="flex flex-col gap-4">
          <Button variant="yellow" size="xl" onClick={onStartLevel1} className="w-full">
            <span className="text-4xl">Nivel 1</span>
            <span className="text-lg font-bold opacity-95">Palabras cortas y fáciles</span>
          </Button>

          <Button variant="blue" size="xl" onClick={onStartLevel2} className="w-full">
            <span className="text-4xl">Nivel 2</span>
            <span className="text-lg font-bold opacity-95">Palabras un poco más difíciles</span>
          </Button>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-black text-dan-coral">{totalWords}</span>
            <span className="text-sm font-bold text-dan-muted uppercase tracking-wide">hoy</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-black text-dan-coral">{bestStreak}</span>
            <span className="text-sm font-bold text-dan-muted uppercase tracking-wide">mejor racha</span>
          </div>
        </div>

        {earned.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-dan-muted uppercase tracking-wide">Tus logros</span>
            <div className="flex flex-wrap justify-center gap-2">
              {earned.map(a => (
                <span
                  key={a.id}
                  title={a.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-[4px] border-dan-border bg-white text-2xl shadow-[0_3px_0_var(--color-dan-border)]"
                >
                  {a.emoji}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
