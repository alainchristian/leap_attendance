import React, { useState } from 'react';
import { Filter, Check } from 'lucide-react';

const FilterDropdown = ({ title, options, onFilterChange, multiple = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(multiple ? [] : null);

  const handleSelect = (option) => {
    let newSelected;
    if (multiple) {
      newSelected = selected.includes(option.value)
        ? selected.filter(value => value !== option.value)
        : [...selected, option.value];
    } else {
      newSelected = selected === option.value ? null : option.value;
    }
    
    setSelected(newSelected);
    onFilterChange(newSelected);
    if (!multiple) setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Filter className="h-4 w-4 mr-2 text-asyv-green" />
        <span>{title}</span>
        {multiple && selected.length > 0 && (
          <span className="ml-2 bg-asyv-green text-white rounded-full px-2 py-0.5 text-xs">
            {selected.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = multiple 
                ? selected.includes(option.value)
                : selected === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-asyv-green" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;