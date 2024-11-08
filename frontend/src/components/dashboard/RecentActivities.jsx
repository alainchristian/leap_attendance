import React from 'react';
import { UserPlus, BookOpen, Check, Clock } from 'lucide-react';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';

const initialActivities = [
  {
    id: 1,
    type: 'registration',
    description: 'New student registered for Piano EP',
    time: '5 minutes ago',
    icon: UserPlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100'
  },
  {
    id: 2,
    type: 'program',
    description: 'Football EP session started',
    time: '10 minutes ago',
    icon: BookOpen,
    iconColor: 'text-asyv-green',
    iconBg: 'bg-green-100'
  },
  {
    id: 3,
    type: 'attendance',
    description: 'Attendance marked for Science EP',
    time: '30 minutes ago',
    icon: Check,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100'
  },
  {
    id: 4,
    type: 'reminder',
    description: 'Rotation 2 registration deadline approaching',
    time: '1 hour ago',
    icon: Clock,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100'
  },
];

// Function to generate new random activities
const generateNewActivity = () => {
  const activities = [
    {
      type: 'registration',
      descriptions: [
        'New student registered for Guitar EP',
        'New student joined Basketball EP',
        'New registration in Visual Arts EP'
      ],
      icon: UserPlus,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100'
    },
    {
      type: 'program',
      descriptions: [
        'Karate EP session started',
        'Electronics EP workshop beginning',
        'Piano practice session started'
      ],
      icon: BookOpen,
      iconColor: 'text-asyv-green',
      iconBg: 'bg-green-100'
    },
    {
      type: 'attendance',
      descriptions: [
        'Attendance updated for Arts EP',
        'Attendance marked for Football EP',
        'Attendance completed for Design EP'
      ],
      icon: Check,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100'
    }
  ];

  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const randomDescription = randomActivity.descriptions[Math.floor(Math.random() * randomActivity.descriptions.length)];

  return {
    id: Date.now(),
    type: randomActivity.type,
    description: randomDescription,
    time: 'Just now',
    icon: randomActivity.icon,
    iconColor: randomActivity.iconColor,
    iconBg: randomActivity.iconBg
  };
};

const RecentActivities = ({ isLive }) => {
  // Custom update function for activities
  const updateActivities = (currentActivities) => {
    if (Math.random() > 0.5) { // 50% chance to add new activity
      const newActivity = generateNewActivity();
      return [newActivity, ...currentActivities.slice(0, -1)];
    }
    return currentActivities;
  };

  const { data: activities } = useRealTimeUpdates(initialActivities, 5000, updateActivities);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-500">Latest updates from all EPs</p>
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

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 animate-fadeIn"
            >
              <div className={`rounded-full p-2 ${activity.iconBg}`}>
                <Icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="mt-4 w-full text-center text-sm text-asyv-green hover:text-asyv-green-dark font-medium"
      >
        View all activities
      </button>
    </div>
  );
};

export default RecentActivities;