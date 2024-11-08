import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';

const initialData = [
  { name: 'Sports', value: 450, color: '#2E7D32' },
  { name: 'Arts', value: 300, color: '#4CAF50' },
  { name: 'Science', value: 300, color: '#81C784' }
];

const ProgramChart = ({ isLive }) => {
  const { data } = useRealTimeUpdates(initialData, 4000);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Students: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">EP Program Distribution</h2>
          <p className="text-sm text-gray-500">Student enrollment by program category</p>
        </div>
        {isLive && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-asyv-green bg-opacity-10 text-asyv-green">
            <span className="mr-1.5 relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asyv-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-asyv-green"></span>
            </span>
            Live
          </span>
        )}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationDuration={500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-sm text-gray-500">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramChart;