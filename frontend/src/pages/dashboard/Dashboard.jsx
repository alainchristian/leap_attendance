import React, { useState } from 'react';
import StatsCards from '../../components/dashboard/StatsCards';
import ProgramChart from '../../components/dashboard/ProgramChart';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import RecentActivities from '../../components/dashboard/RecentActivities';
import DateRangeSelector from '../../components/common/DateRangeSelector';
import FilterDropdown from '../../components/common/FilterDropdown';
import { Play, Pause } from 'lucide-react';




const programOptions = [
  { label: 'All Programs', value: 'all' },
  { label: 'Sports', value: 'sports' },
  { label: 'Arts', value: 'arts' },
  { label: 'Science', value: 'science' }
];

const gradeOptions = [
  { label: 'All Grades', value: 'all' },
  { label: 'EY', value: 'ey' },
  { label: 'S4', value: 's4' }
];

const Dashboard = () => {
  const [isLive, setIsLive] = useState(true);

  const handleRangeChange = (range) => {
    console.log('Date range changed:', range);
  };

  const handleProgramFilter = (selected) => {
    console.log('Program filter changed:', selected);
  };

  const handleGradeFilter = (selected) => {
    console.log('Grade filter changed:', selected);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of EP Programs and Activities
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown 
            title="Program"
            options={programOptions}
            onFilterChange={handleProgramFilter}
          />
          <FilterDropdown 
            title="Grade"
            options={gradeOptions}
            onFilterChange={handleGradeFilter}
          />
          <DateRangeSelector onRangeChange={handleRangeChange} />
          <button
            onClick={() => setIsLive(!isLive)}
            className={`
              inline-flex items-center px-4 py-2 border rounded-lg
              text-sm font-medium
              ${isLive 
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-asyv-green text-asyv-green hover:bg-green-50'
              }
            `}
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center justify-end space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asyv-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-asyv-green"></span>
          </span>
          <span className="text-sm text-asyv-green">Live Updates Enabled</span>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards isLive={isLive} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramChart isLive={isLive} />
        <AttendanceChart isLive={isLive} />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivities isLive={isLive} />
      </div>
    </div>
  );
};

export default Dashboard;