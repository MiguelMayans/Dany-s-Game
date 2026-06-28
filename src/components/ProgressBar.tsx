interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2" aria-label="Progreso del nivel">
      <div className="h-5 w-full rounded-full border-4 border-dan-border bg-[#e8e4f3] shadow-inner">
        <div
          className="h-full rounded-full bg-linear-90 from-dan-yellow to-dan-green transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-lg font-extrabold text-dan-border">
        Palabra {current + 1} de {total}
      </span>
    </div>
  );
}
