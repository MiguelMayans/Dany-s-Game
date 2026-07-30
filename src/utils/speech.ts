import { isMuted } from './sounds';

let voicesReady = false;
let spanishVoice: SpeechSynthesisVoice | null = null;
// Keep a reference so the utterance isn't garbage-collected mid-speech (Chrome bug).
let currentUtterance: SpeechSynthesisUtterance | null = null;
// Pending delayed speak (cancel+speak in the same tick is unreliable in Chrome).
let speakTimer: number | null = null;
let watchdogStarted = false;

// Chrome can silently pause synthesis after inactivity; nudge it periodically.
function startWatchdog(): void {
  if (watchdogStarted || typeof window === 'undefined' || !window.speechSynthesis) return;
  watchdogStarted = true;
  window.setInterval(() => {
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignore */
    }
  }, 8000);
}

function isSpanish(voice: SpeechSynthesisVoice): boolean {
  return voice.lang.toLowerCase().startsWith('es');
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const preferred = voices.find(
    v =>
      isSpanish(v) &&
      (v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('maría') ||
        v.name.toLowerCase().includes('monica') ||
        v.name.toLowerCase().includes('helena')),
  );
  return preferred ?? voices.find(isSpanish) ?? null;
}

function refreshVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  voicesReady = true;
  spanishVoice = pickSpanishVoice(voices);

  if (import.meta.env.DEV) {
    console.log('[speech] voices loaded:', voices.length, spanishVoice?.name ?? 'no Spanish voice');
  }
}

export function loadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  startWatchdog();
  refreshVoices();

  window.speechSynthesis.onvoiceschanged = () => {
    refreshVoices();
  };

  // Some browsers need a small nudge before voices become available.
  if (!voicesReady) {
    setTimeout(refreshVoices, 100);
    setTimeout(refreshVoices, 500);
  }
}

function ensureVoices(): void {
  if (!voicesReady) {
    refreshVoices();
  }
}

function speak(text: string, rate = 0.9, pitch = 1.05): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (isMuted()) return;

  try {
    ensureVoices();
    const synth = window.speechSynthesis;
    synth.cancel();
    if (speakTimer !== null) {
      clearTimeout(speakTimer);
      speakTimer = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onerror = event => {
      if (import.meta.env.DEV) {
        console.warn('[speech] error:', event.error);
      }
    };

    currentUtterance = utterance;
    utterance.onend = () => {
      if (currentUtterance === utterance) currentUtterance = null;
    };

    // Small delay after cancel(): speaking in the same tick as cancel() can
    // silently drop the utterance in some browsers.
    speakTimer = window.setTimeout(() => {
      speakTimer = null;
      synth.resume();
      synth.speak(utterance);
    }, 40);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[speech] speak failed:', error);
    }
  }
}

export function speakWord(word: string): void {
  speak(word, 0.85, 1.05);
}

export function speakLetter(letter: string): void {
  speak(letter, 0.95, 1.05);
}

export function speakPhrase(phrase: string): void {
  speak(phrase, 0.9, 1.1);
}
