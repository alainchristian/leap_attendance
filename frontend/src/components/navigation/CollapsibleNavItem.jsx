import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CollapsibleNavItem = ({ item, isActive, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const menuRef = useRef(null);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const Icon = item.icon;

  // Keep submenu open if parent or any child is active
  useEffect(() => {
    if (isActive || (item.subItems && item.subItems.some(subItem => subItem.current))) {
      setIsOpen(true);
    }
  }, [isActive, item.subItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Don't auto-close on desktop
        if (window.innerWidth < 1024) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleMainClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else {
      onNavigate(item.name);
    }
  };

  const handleSubItemClick = (e, subItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only close menu on mobile
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
    
    onNavigate(subItem.name);
  };

  return (
    <div className="relative space-y-1" ref={menuRef}>
      <button
        onClick={handleMainClick}
        type="button"
        className={`
          group flex items-center justify-between px-3 py-2
          text-sm font-medium rounded-lg w-full
          ${isActive && !hasSubItems 
            ? 'bg-asyv-green text-white'
            : 'text-white hover:bg-asyv-green-light'
          }
          transition-colors duration-150
          touch-manipulation
          z-20
        `}
      >
        <div className="flex items-center">
          <Icon className="mr-3 h-5 w-5" />
          <span>{item.name}</span>
        </div>
        {hasSubItems && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ease-in-out
              ${isOpen ? 'transform rotate-180' : ''}
            `}
          />
        )}
      </button>

      {hasSubItems && (
        <div
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
            relative z-10
          `}
        >
          <div className="pl-4 space-y-1 py-1">
            {item.subItems.map((subItem, index) => {
              const SubIcon = subItem.icon;
              const isSubItemActive = subItem.current;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => handleSubItemClick(e, subItem)}
                  className={`
                    group flex items-center py-2 px-3 text-sm font-medium
                    rounded-lg w-full transition-colors duration-150
                    ${isSubItemActive
                      ? 'bg-asyv-green bg-opacity-75 text-white'
                      : 'text-white hover:bg-asyv-green-light'
                    }
                    touch-manipulation
                  `}
                >
                  {SubIcon && <SubIcon className="mr-3 h-4 w-4" />}
                  {subItem.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleNavItem;