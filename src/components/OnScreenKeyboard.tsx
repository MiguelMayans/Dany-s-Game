import Key from './ui/Key';

interface Props {
  onKeyPress: (k: string) => void;
  hintLetter?: string | null;
}

const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function OnScreenKeyboard({ onKeyPress, hintLetter = null }: Props) {
  let colorIdx = 0;

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3" role="group" aria-label="Teclado en pantalla">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex flex-wrap justify-center gap-1 sm:gap-1.5 md:gap-2"
        >
          {row.map(letter => (
            <Key
              key={letter}
              letter={letter}
              onPress={onKeyPress}
              colorIndex={colorIdx++}
              hint={!!hintLetter && letter === hintLetter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
