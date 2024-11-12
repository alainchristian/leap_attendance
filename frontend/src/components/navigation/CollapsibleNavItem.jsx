import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CollapsibleNavItem = ({ item, isActive, onCloseSidebar }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const location = useLocation();

  // Update open state when active state changes
  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const handleClick = () => {
    if (item.subItems) {
      setIsOpen(!isOpen);
    } else {
      onCloseSidebar?.();
    }
  };

  const isItemActive = (href) => location.pathname === href;

  // Base classes for menu items
  const baseClasses = "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150";
  const activeClasses = "text-white bg-asyv-green";
  const inactiveClasses = "text-gray-300 hover:text-white hover:bg-asyv-green-dark";

  // If item has subItems, render as collapsible section
  if (item.subItems) {
    const hasActiveChild = item.subItems.some(subItem => isItemActive(subItem.href));

    return (
      <div className="space-y-1">
        <button
          onClick={handleClick}
          className={`${baseClasses} justify-between ${hasActiveChild ? activeClasses : inactiveClasses}`}
        >
          <div className="flex items-center">
            {item.icon && <item.icon className="mr-3 h-5 w-5" />}
            <span>{item.name}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isOpen && item.subItems && (
          <div className="ml-4 space-y-1">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`${baseClasses} pl-5 ${
                  isItemActive(subItem.href) ? activeClasses : inactiveClasses
                }`}
                onClick={onCloseSidebar}
              >
                {subItem.icon && <subItem.icon className="mr-3 h-5 w-5" />}
                <span>{subItem.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // For items without subItems, render as simple link
  return (
    <Link
      to={item.href}
      className={`${baseClasses} ${
        isItemActive(item.href) ? activeClasses : inactiveClasses
      }`}
      onClick={onCloseSidebar}
    >
      {item.icon && <item.icon className="mr-3 h-5 w-5" />}
      <span>{item.name}</span>
    </Link>
  );
};

export default CollapsibleNavItem;