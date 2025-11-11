interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const getColor = () => {
    if (clampedProgress < 25) return "bg-red-500";
    if (clampedProgress < 50) return "bg-orange-500";
    if (clampedProgress < 75) return "bg-yellow-500";
    if (clampedProgress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 relative">
      <div
        className={`h-full ${getColor()} transition-all rounded-full duration-500 ease-in-out`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
      <span className="absolute right-2 top-[-22px] text-sm font-medium text-gray-700">
        {clampedProgress}%
      </span>
    </div>
  );
}
