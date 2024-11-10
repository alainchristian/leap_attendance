import React, { useState, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  const baseInputClasses = [
    'peer',
    'block w-full px-4 py-3',
    Icon ? 'pl-12' : '',
    'border',
    error ? 'border-red-300' : 'border-gray-200',
    'rounded-lg',
    'text-gray-900',
    'bg-white',
    error ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-asyv-green focus:ring-asyv-green',
    'focus:outline-none',
    'focus:ring-1',
    'disabled:bg-gray-50',
    'disabled:cursor-not-allowed',
    'placeholder-transparent',
    'transition duration-200',
    className
  ].filter(Boolean).join(' ');

  const baseLabelClasses = [
    'absolute left-0 -top-2.5 px-2 bg-white',
    'text-sm transition-all duration-200',
    'pointer-events-none',
    Icon ? 'left-12' : 'left-4',
    (isFocused || hasValue) ? [
      error ? 'text-red-500' : 'text-asyv-green',
      'text-sm transform translate-y-0',
      Icon ? 'left-4' : 'left-4'
    ].join(' ') : 'text-gray-500 transform translate-y-8'
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Icon className={error ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-gray-400'} />
          </div>
        )}
        <input
          ref={ref}
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={baseInputClasses}
          placeholder={placeholder || label}
          {...props}
        />
        <label
          htmlFor={name}
          className={baseLabelClasses}
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
});

Input.displayName = 'Input';

export default Input;