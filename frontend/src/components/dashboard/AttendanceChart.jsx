import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';

const initialData = [
  { name: 'Week 1', attendance: 95, average: 92 },
  { name: 'Week 2', attendance: 98, average: 93 },
  { name: 'Week 3', attendance: 92, average: 92 },
  { name: 'Week 4', attendance: 96, average: 94 },
  { name: 'Week 5', attendance: 94, average: 93 },
  { name: 'Week 6', attendance: 97, average: 95 },
];

const AttendanceChart = ({ isLive }) => {
  const { data } = useRealTimeUpdates(initialData, 3000);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Attendance Trends</h2>
          <p className="text-sm text-gray-500">Weekly attendance rate comparison</p>
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
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[85, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#2E7D32" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Current Attendance"
              dot={{ strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#4CAF50" 
              strokeDasharray="5 5"
              strokeWidth={2}
              name="Average Attendance"
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;