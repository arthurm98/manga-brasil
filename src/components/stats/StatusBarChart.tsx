
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface StatItem {
  name: string;
  value: number;
  color: string;
}

interface StatusBarChartProps {
  chartData: StatItem[];
}

const StatusBarChart: React.FC<StatusBarChartProps> = ({ chartData }) => {
  const config = {
    
    reading: { color: '#8B5CF6' },
    planned: { color: '#0EA5E9' },
    completed: { color: '#10B981' },
    dropped: { color: '#6B7280' },
  };

  // Função formatadora para o tooltip
  const formatTooltip = (value: number, name: string) => {
    return [`${value} título${value !== 1 ? 's' : ''}`, name];
  };

  return (
    <div className="bg-black/80 dark:bg-black/90 p-4 rounded-lg border border-gray-800 shadow-sm h-[300px]">
      <ChartContainer config={config} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <ChartTooltip content={<ChartTooltipContent formatter={formatTooltip} />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default StatusBarChart;
