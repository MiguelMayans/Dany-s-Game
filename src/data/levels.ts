import { WORDS, type Word } from './words';
import { lettersOf } from '../game/letters';

export type LevelId = 'cortas' | 'medianas' | 'largas' | 'secretas';

export interface Level {
  id: LevelId;
  name: string;
  /** Short line for grown-ups on the menu. */
  hint: string;
  /** 1–3, drawn as dots on the menu. */
  difficulty: number;
  color: string;
  /** Letters stay hidden until typed: the word is only heard. */
  hidden: boolean;
  words: Word[];
}

const len = (w: Word) => lettersOf(w.text).length;

export const ROUND_SIZE = 6;

export const LEVELS: Level[] = [
  {
    id: 'cortas',
    name: 'Cortitas',
    hint: 'Hasta 4 letras',
    difficulty: 1,
    color: '#ffd96b',
    hidden: false,
    words: WORDS.filter(w => len(w) <= 4),
  },
  {
    id: 'medianas',
    name: 'Medianas',
    hint: '5 y 6 letras',
    difficulty: 2,
    color: '#93ddb0',
    hidden: false,
    words: WORDS.filter(w => len(w) >= 5 && len(w) <= 6),
  },
  {
    id: 'largas',
    name: 'Larguísimas',
    hint: '7 letras o más',
    difficulty: 3,
    color: '#9ccbf5',
    hidden: false,
    words: WORDS.filter(w => len(w) >= 7),
  },
  {
    id: 'secretas',
    name: 'Secretas',
    hint: 'Letras escondidas: escucha y escribe',
    difficulty: 3,
    color: '#f7aab6',
    hidden: true,
    words: WORDS.filter(w => len(w) <= 5),
  },
];

export function getLevel(id: LevelId): Level {
  return LEVELS.find(l => l.id === id) ?? LEVELS[0];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick a short round. Normal levels favour words whose sticker is still
 * missing, so the album keeps growing; the hidden-letters level favours words
 * the child has already practised.
 */
export function pickRound(level: Level, collected: Record<string, number>): Word[] {
  const seen = level.words.filter(w => collected[w.text] !== undefined);
  const unseen = level.words.filter(w => collected[w.text] === undefined);
  const ordered = level.hidden
    ? [...shuffle(seen), ...shuffle(unseen)]
    : [...shuffle(unseen), ...shuffle(seen)];
  return shuffle(ordered.slice(0, ROUND_SIZE));
}
