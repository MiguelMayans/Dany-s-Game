export interface Spark {
  id: number;
  letterIndex: number;
  offset: number;
}

export type Level = 'level1' | 'level2';

export type GameScreen = 'menu' | 'playing' | 'victory';

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  condition: (state: Pick<GameState, 'totalWordsToday' | 'streak' | 'bestStreak'>) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'novice', name: 'Aprendiz', emoji: '🥉', condition: s => s.totalWordsToday >= 5 },
  { id: 'expert', name: 'Experto', emoji: '🥈', condition: s => s.totalWordsToday >= 20 },
  { id: 'master', name: 'Maestro', emoji: '🥇', condition: s => s.totalWordsToday >= 50 },
  { id: 'streak_3', name: 'Racha de 3', emoji: '🔥', condition: s => s.streak >= 3 },
  { id: 'streak_5', name: 'Racha de 5', emoji: '⚡', condition: s => s.streak >= 5 },
  { id: 'streak_10', name: 'Racha de 10', emoji: '🌟', condition: s => s.streak >= 10 },
  { id: 'best_streak_10', name: 'Mejor racha 10', emoji: '🏆', condition: s => s.bestStreak >= 10 },
];

export interface GameState {
  screen: GameScreen;
  level: Level | null;
  word: string;
  pos: number;
  wrong: boolean;
  wrongIndex: number | null;
  success: boolean;
  poppedIndex: number | null;
  sparks: Spark[];
  currentIndex: number;
  levelWords: string[];
  streak: number;
  bestStreak: number;
  totalWordsToday: number;
  achievements: Set<string>;
  newAchievements: string[];
}

export type GameAction =
  | { type: 'START_LEVEL'; level: Level; words: string[] }
  | { type: 'KEY_PRESS'; key: string; sparks?: Spark[] }
  | { type: 'CLEAR_POP' }
  | { type: 'CLEAR_WRONG' }
  | { type: 'CLEAR_SPARKS'; ids: number[] }
  | { type: 'CLEAR_NEW_ACHIEVEMENTS' }
  | { type: 'NEXT_WORD' }
  | { type: 'GO_MENU' }
  | { type: 'ADD_ACHIEVEMENT'; id: string };
