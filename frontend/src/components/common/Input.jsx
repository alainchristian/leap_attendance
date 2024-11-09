import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            peer
            block w-full px-4 py-3 
            ${Icon ? 'pl-12' : ''}
            border border-gray-200
            rounded-lg
            text-gray-900
            bg-white
            focus:border-asyv-green
            focus:outline-none
            disabled:bg-gray-50
            disabled:cursor-not-allowed
            placeholder-transparent
            transition duration-200
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          placeholder={placeholder || label}
        />
        <label
          className={`
            absolute left-0 -top-2.5 px-2 bg-white
            text-sm transition-all duration-200
            pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            ${(isFocused || hasValue) 
              ? `text-asyv-green text-sm transform translate-y-0 
                 ${Icon ? 'left-4' : 'left-4'}`
              : 'text-gray-500 transform translate-y-8'
            }
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;