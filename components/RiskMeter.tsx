
import React from 'react';
import { COLORS } from '../constants';

interface RiskMeterProps {
  score: number; // 0 to 100
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
  const getRiskColor = () => {
    if (score < 30) return COLORS.riskLow;
    if (score < 60) return COLORS.riskMedium;
    if (score < 85) return COLORS.riskHigh;
    return COLORS.riskCritical;
  };

  const getRiskLabel = () => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    if (score < 85) return 'High Risk';
    return 'Critical Risk';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="#e2e8f0"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke={getRiskColor()}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: getRiskColor() }}>{score}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Score</span>
        </div>
      </div>
      <div className="mt-2 text-sm font-bold uppercase tracking-widest" style={{ color: getRiskColor() }}>
        {getRiskLabel()}
      </div>
    </div>
  );
};

export default RiskMeter;
