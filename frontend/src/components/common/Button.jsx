import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-800 focus:ring-0 focus:ring-indigo-500 focus:ring-offset-0',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-400 focus:ring-0 focus:ring-indigo-500 focus:ring-offset-0',
    danger: 'bg-red-600 text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-0',
    success: 'bg-green-600 text-white hover:bg-green-800 focus:ring-0 focus:ring-green-500 focus:ring-offset-0',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const width = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {Icon && !loading && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;