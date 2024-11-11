// src/components/common/Placeholder.jsx
import React from 'react';

const Placeholder = ({ width = 48, height = 48, className = '' }) => {
  return (
    <div 
      className={`bg-gray-200 flex items-center justify-center rounded-full ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        className="text-gray-400"
        width={width * 0.5}
        height={height * 0.5}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
};

export default Placeholder;