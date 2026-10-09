/**
 * The key a child has to press for a written letter: accents and diaeresis are
 * dropped (á → a, ü → u) but ñ is its own letter in Spanish and is kept.
 */
export function keyFor(ch: string): string {
  const c = ch.toLowerCase();
  if (c === 'ñ') return c;
  return c.normalize('NFD').replace(/\p{M}/gu, '');
}

/** Split a word into letters (safe for precomposed accented characters). */
export function lettersOf(word: string): string[] {
  return Array.from(word.normalize('NFC'));
}

export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const KEYS = new Set(KEYBOARD_ROWS.flat());

// Spoken names of the letters, so the speech engine says "uve" or "i griega"
// instead of guessing from a lone character.
const LETTER_NAMES: Record<string, string> = {
  a: 'a', b: 'be', c: 'ce', d: 'de', e: 'e', f: 'efe', g: 'ge', h: 'hache',
  i: 'i', j: 'jota', k: 'ka', l: 'ele', m: 'eme', n: 'ene', ñ: 'eñe', o: 'o',
  p: 'pe', q: 'cu', r: 'erre', s: 'ese', t: 'te', u: 'u', v: 'uve',
  w: 'uve doble', x: 'equis', y: 'i griega', z: 'zeta',
};

export function letterName(ch: string): string {
  const k = keyFor(ch);
  return LETTER_NAMES[k] ?? k;
}
