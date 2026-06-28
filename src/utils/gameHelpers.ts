import { words } from '../data/words';
import type { Level } from '../types/game';

export interface WordEntry {
  word: string;
  img: string;
}

export function getWordsForLevel(level: Level): WordEntry[] {
  return words[level];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function findWordEntry(word: string): WordEntry | undefined {
  const all = [...words.level1, ...words.level2];
  return all.find(e => e.word.toLowerCase() === word.toLowerCase());
}
