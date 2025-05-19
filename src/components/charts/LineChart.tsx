
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  dataKey?: string;
  xAxisDataKey?: string;
  color?: string;
  animate?: boolean;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey = 'value',
  xAxisDataKey = 'date',
  color = '#00FFFF',
  animate = true,
  formatYAxis,
  formatTooltip
}) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 8, strokeWidth: 2 }}
          isAnimationActive={animate}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
