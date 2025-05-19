
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisDataKey: string;
  color?: string;
  animate?: boolean;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisDataKey,
  color = '#00FFFF',
  animate = true,
  formatYAxis,
  formatTooltip
}) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey={xAxisDataKey} 
          stroke="rgba(255,255,255,0.5)"
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.5)" 
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
          tickFormatter={formatYAxis}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(13, 18, 30, 0.9)', 
            borderColor: color, 
            borderRadius: '8px',
            boxShadow: `0 0 10px ${color}40`
          }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color }}
          formatter={formatTooltip ? formatTooltip : (value) => value}
        />
        <Bar 
          dataKey={dataKey} 
          fill={color}
          radius={[4, 4, 0, 0]}
          isAnimationActive={animate}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
