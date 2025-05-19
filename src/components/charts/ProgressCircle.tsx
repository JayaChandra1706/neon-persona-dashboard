
import React from 'react';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  fontSize?: number;
  children?: React.ReactNode;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#00FFFF',
  bgColor = 'rgba(255, 255, 255, 0.1)',
  fontSize = 24,
  children
}) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate the circumference of the circle
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the dash offset based on the percentage
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {children ? children : (
          <span className="font-bold" style={{ fontSize }}>
            {validPercentage}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressCircle;
