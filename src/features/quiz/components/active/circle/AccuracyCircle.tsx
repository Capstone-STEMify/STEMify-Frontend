interface AccuracyCircleProps {
  accuracy: number | null;
}

export function AccuracyCircle({ accuracy }: AccuracyCircleProps) {
  if (accuracy === null) {
    return <span className="text-gray-400">-</span>;
  }

  const getRingColor = (value: number) => {
    if (value >= 90) return "from-green-500 to-green-400";
    if (value >= 70) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  const ringColor = getRingColor(accuracy);

  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      <svg className="absolute" width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="transparent"
          stroke="url(#accuracy-gradient)"
          strokeWidth="3"
          strokeDasharray={`${(accuracy * 2 * Math.PI * 17) / 100} ${2 * Math.PI * 17}`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
        <defs>
          <linearGradient id="accuracy-gradient">
            <stop offset="0%" stopColor={accuracy >= 90 ? '#22c55e' : (accuracy >= 70 ? '#f97316' : '#ef4444')} />
            <stop offset="100%" stopColor={accuracy >= 90 ? '#4ade80' : (accuracy >= 70 ? '#fb923c' : '#f87171')} />
          </linearGradient>
        </defs>
      </svg>
      <span className={`text-xs font-semibold text-gray-700`}>
        {accuracy}%
      </span>
    </div>
  );
}