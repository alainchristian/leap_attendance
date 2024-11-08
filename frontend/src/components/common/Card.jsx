import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  padding = true,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {(title || action) && (
        <div className="border-b border-gray-200">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="h-5 w-5 text-gray-400" />}
              <div>
                {title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={padding ? 'p-4 sm:p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;