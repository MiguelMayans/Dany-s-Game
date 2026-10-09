import { KEYBOARD_ROWS } from '../game/letters';

interface Props {
  onPress: (key: string) => void;
  /** Key that glows to help after a few misses. */
  hintKey: string | null;
  /** Last key pressed on the physical keyboard, echoed on screen. */
  flash: { key: string; n: number } | null;
}

export default function Keyboard({ onPress, hintKey, flash }: Props) {
  return (
    <div className="flex flex-col items-center gap-[1.6dvh]" role="group" aria-label="Teclado">
      {KEYBOARD_ROWS.map((row, r) => (
        <div key={r} className="flex justify-center gap-[min(1vw,8px)]">
          {row.map(letter => {
            const flashing = flash?.key === letter;
            return (
              <button
                // A new key per flash restarts the press animation.
                key={flashing ? `${letter}-${flash.n}` : letter}
                type="button"
                className={[
                  'tblock key',
                  letter === hintKey ? 'is-hint' : '',
                  flashing ? 'is-flash' : '',
                ].join(' ')}
                aria-label={letter.toUpperCase()}
                onPointerDown={e => {
                  // Pointer down feels instant on tablets (no click delay).
                  e.preventDefault();
                  onPress(letter);
                }}
                onClick={e => {
                  // detail 0: activated with Tab+Enter or a screen reader.
                  if (e.detail === 0) onPress(letter);
                }}
              >
                <span className="tblock-face">{letter.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
