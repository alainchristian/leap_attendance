import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  UserCheck,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';

const StatsCard = ({ title, value, change, icon: Icon, changeType, isLive }) => {
  const { data } = useRealTimeUpdates({ value, change }, 2000);

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-asyv-green';
    if (changeType === 'decrease') return 'text-red-500';
    return 'text-gray-500';
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center justify-center p-3 bg-asyv-green bg-opacity-10 rounded-lg">
          <Icon className="h-6 w-6 text-asyv-green" />
        </div>
        <div className="flex items-center space-x-2">
          {change && (
            <div className={`flex items-center ${getChangeColor()}`}>
              <ChangeIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{data.change}</span>
            </div>
          )}
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asyv-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-asyv-green"></span>
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        </p>
      </div>
    </div>
  );
};

const StatsCards = ({ isLive }) => {
  const initialStats = [
    {
      title: 'Total Students',
      value: 2345,
      change: '+12%',
      icon: Users,
      changeType: 'increase'
    },
    {
      title: 'Active Programs',
      value: 15,
      change: '+2',
      icon: GraduationCap,
      changeType: 'increase'
    },
    {
      title: 'Current Rotation',
      value: 'Rotation 2',
      icon: Calendar
    },
    {
      title: "Today's Attendance",
      value: 98,
      change: '+3%',
      icon: UserCheck,
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {initialStats.map((stat, index) => (
        <StatsCard key={index} {...stat} isLive={isLive} />
      ))}
    </div>
  );
};

export default StatsCards;