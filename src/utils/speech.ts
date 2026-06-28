let voicesReady = false;
let spanishVoice: SpeechSynthesisVoice | null = null;

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

  try {
    ensureVoices();
    window.speechSynthesis.cancel();

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

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[speech] speak failed:', error);
    }
  }
}

export function speakWord(word: string): void {
  speak(word, 0.85, 1.05);
}

export function speakPhrase(phrase: string): void {
  speak(phrase, 0.9, 1.1);
}
