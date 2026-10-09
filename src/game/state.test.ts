import { describe, expect, it } from 'vitest';
import { LEVELS, ROUND_SIZE, pickRound } from '../data/levels';
import { WORDS, type Word } from '../data/words';
import { keyFor, letterName, lettersOf } from './letters';
import { HINT_AFTER, expectedKey, initialState, reducer, starsFor, type State } from './state';
import { localDay } from './storage';

const word = (text: string): Word => ({ text, emoji: '⭐', color: '#fff' });

function playing(texts: string[]): State {
  const base = initialState({ stickers: {}, day: localDay(), today: 0 });
  return reducer(base, { type: 'start', levelId: 'cortas', round: texts.map(word) });
}

function type(state: State, keys: string): State {
  return [...keys].reduce((s, key) => reducer(s, { type: 'press', key }), state);
}

describe('letters', () => {
  it('maps accented letters to their plain key but keeps ñ', () => {
    expect(keyFor('á')).toBe('a');
    expect(keyFor('Ü')).toBe('u');
    expect(keyFor('ñ')).toBe('ñ');
    expect(lettersOf('pingüino')).toHaveLength(8);
  });

  it('names letters the Spanish way', () => {
    expect(letterName('v')).toBe('uve');
    expect(letterName('y')).toBe('i griega');
    expect(letterName('é')).toBe('e');
  });

  it('every word is typeable on the on-screen keyboard', () => {
    for (const w of WORDS) {
      for (const ch of lettersOf(w.text)) expect(keyFor(ch)).toMatch(/^[a-zñ]$/);
    }
  });

  it('has no duplicated words', () => {
    expect(new Set(WORDS.map(w => w.text)).size).toBe(WORDS.length);
  });
});

describe('reducer', () => {
  it('accepts plain keys for accented letters and finishes the word', () => {
    const s = type(playing(['papá']), 'papa');
    expect(s.solved).toBe(true);
    expect(s.results).toEqual([{ word: word('papá'), stars: 3, isNew: true }]);
    expect(s.progress.stickers['papá']).toBe(3);
    expect(s.progress.today).toBe(1);
  });

  it('counts misses, asks for help after a few, and resets help on a hit', () => {
    let s = type(playing(['sol']), 'x'.repeat(HINT_AFTER));
    expect(s.pos).toBe(0);
    expect(s.missesHere).toBe(HINT_AFTER);
    s = type(s, 's');
    expect(s.missesHere).toBe(0);
    expect(s.mistakes).toBe(HINT_AFTER);
  });

  it('gives fewer stars for more mistakes and keeps the best per sticker', () => {
    expect([0, 1, 2, 3, 9].map(starsFor)).toEqual([3, 2, 2, 1, 1]);
    let s = type(playing(['sol', 'sol']), 'xxxsol');
    expect(s.progress.stickers.sol).toBe(1);
    s = type(reducer(s, { type: 'next' }), 'sol');
    expect(s.progress.stickers.sol).toBe(3);
    expect(s.results[1].isNew).toBe(false);
  });

  it('ignores keys after the word is solved and ends the round after the last word', () => {
    let s = type(playing(['pez']), 'pez');
    expect(expectedKey(s)).toBeNull();
    expect(type(s, 'q')).toBe(s);
    s = reducer(s, { type: 'next' });
    expect(s.screen).toBe('roundEnd');
  });
});

describe('levels', () => {
  it('every level can fill a round', () => {
    for (const level of LEVELS) {
      expect(level.words.length).toBeGreaterThanOrEqual(ROUND_SIZE);
      expect(pickRound(level, {})).toHaveLength(ROUND_SIZE);
    }
  });

  it('prefers stickers that are still missing', () => {
    const level = LEVELS[0];
    const collected = Object.fromEntries(level.words.slice(ROUND_SIZE).map(w => [w.text, 3]));
    const round = pickRound(level, collected).map(w => w.text).sort();
    expect(round).toEqual(level.words.slice(0, ROUND_SIZE).map(w => w.text).sort());
  });
});
