import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  loading = false,
  className = '',
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUp : ArrowDown;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="ml-4 flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-gray-500 truncate">
              {title}
            </h3>
            {change && (
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor()}`}>
                <div className="flex items-center space-x-1">
                  <ChangeIcon className="h-3 w-3" />
                  <span>{change}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-1">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;