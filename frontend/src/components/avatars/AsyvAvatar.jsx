import React from 'react';
import DefaultAvatar from './DefaultAvatar';

const AsyvAvatar = ({ 
  user,
  size = 'md',
  showStatus = false,
  className = '' 
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const baseClasses = `${sizes[size]} rounded-full flex items-center justify-center relative`;
  const statusClasses = showStatus ? 'ring-2 ring-white' : '';

  // If user has a custom avatar image
  if (user?.avatar) {
    return (
      <div className={`${baseClasses} ${className}`}>
        <img
          src={user.avatar}
        //   alt={user.name || 'User avatar'}
          className={`rounded-full object-cover ${statusClasses}`}
        />
        {showStatus && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-asyv-green ring-2 ring-white" />
        )}
      </div>
    );
  }

  // If user has a name, show initials
  if (user?.name) {
    return (
      <div 
        className={`
          ${baseClasses}
          ${statusClasses}
          ${className}
          bg-gradient-to-br from-asyv-green to-asyv-green-dark
          text-white font-semibold
        `}
      >
        {getInitials(user.name)}
        {showStatus && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-asyv-green ring-2 ring-white" />
        )}
      </div>
    );
  }

  // Default avatar
  return (
    <div className={`${baseClasses} ${statusClasses} ${className}`}>
      <DefaultAvatar className="w-full h-full" />
      {showStatus && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-asyv-green ring-2 ring-white" />
      )}
    </div>
  );
};

export default AsyvAvatar;