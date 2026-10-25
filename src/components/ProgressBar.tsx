interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ value, max, label, showPercentage = true }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-1">
      {label && <div className="text-sm font-semibold text-cyan">{label}</div>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-steel-gray rounded-full overflow-hidden border border-cyan/20">
          <div
            className="h-full bg-gradient-to-r from-cyan to-cyan-dark transition-all duration-500 shadow-lg shadow-cyan/50"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && <span className="text-sm font-semibold text-cyan w-12 text-right">{percentage}%</span>}
      </div>
    </div>
  );
}
