import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const predefinedRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'This Term', value: 'term' },
  { label: 'Custom Range', value: 'custom' }
];

const DateRangeSelector = ({ onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(predefinedRanges[2]);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setIsOpen(false);
    onRangeChange(range.value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Calendar className="h-4 w-4 mr-2 text-asyv-green" />
        <span>{selectedRange.label}</span>
        <ChevronDown className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {predefinedRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleRangeSelect(range)}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${selectedRange.value === range.value
                    ? 'bg-asyv-green-light text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;