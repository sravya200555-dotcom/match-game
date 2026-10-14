import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showGrade?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Score',
  showGrade = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return '#10B981'; // emerald
    if (val >= 75) return '#6366F1'; // indigo
    if (val >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getGrade = (val: number) => {
    if (val >= 90) return 'Exceptional';
    if (val >= 80) return 'Strong';
    if (val >= 70) return 'Moderate';
    return 'Needs Work';
  };

  const strokeColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
          </div>
          {showGrade && (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1"
              style={{
                backgroundColor: `${strokeColor}15`,
                color: strokeColor,
              }}
            >
              {getGrade(score)}
            </span>
          )}
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</span>}
    </div>
  );
};
