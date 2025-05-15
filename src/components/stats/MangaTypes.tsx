
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MangaTypesProps {
  types: { name: string; count: number }[];
}

const MangaTypes: React.FC<MangaTypesProps> = ({ types }) => {
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B'];
  
  return (
    <div className="bg-black/80 dark:bg-black/90 p-4 rounded-lg border border-gray-800 shadow-sm h-[300px]">
      {types.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={types}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="count"
              nameKey="name"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {types.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} título${value !== 1 ? 's' : ''}`, 'Quantidade']}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
};

export default MangaTypes;
