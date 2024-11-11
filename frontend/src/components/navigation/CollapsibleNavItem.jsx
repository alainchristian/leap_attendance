// src/components/navigation/CollapsibleNavItem.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/auth.context';
import { ROLE_PERMISSIONS } from '../../utils/permissions';

const CollapsibleNavItem = ({ item, isActive, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const menuRef = useRef(null);
  const { hasPermission, getUserRoles, user } = useAuth();

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const Icon = item.icon;
  const userRoles = getUserRoles();

  // Debug permissions with enhanced logging
  useEffect(() => {
    console.log('Navigation Item Permissions:', {
      item: {
        name: item.name,
        permission: item.permission,
        hasSubItems,
        subItemsCount: item.subItems?.length
      },
      user: {
        email: user?.email,
        roles: userRoles,
        rolePermissions: userRoles.map(role => ({
          role,
          permissions: ROLE_PERMISSIONS[role]
        }))
      },
      access: {
        hasPermission: !item.permission || hasPermission(item.permission),
        visibleSubItems: hasSubItems ? 
          item.subItems.filter(subItem => !subItem.permission || hasPermission(subItem.permission)).length : 0
      }
    });
  }, [item, hasPermission, userRoles, user, hasSubItems]);

  // Permission check for main item
  if (item.permission && !hasPermission(item.permission)) {
    console.log(`Access Denied: ${item.name} requires ${item.permission}`);
    return null;
  }

  // Check permissions for subitems
  const visibleSubItems = hasSubItems 
    ? item.subItems.filter(subItem => {
        const hasAccess = !subItem.permission || hasPermission(subItem.permission);
        if (!hasAccess) {
          console.log(`Subitem Hidden: ${subItem.name} requires ${subItem.permission}`);
        }
        return hasAccess;
      })
    : [];

  if (hasSubItems && visibleSubItems.length === 0) {
    console.log(`No accessible subitems for ${item.name}`);
    return null;
  }

  // Keep submenu open if parent or any child is active
  useEffect(() => {
    if (isActive || (item.subItems && item.subItems.some(subItem => subItem.current))) {
      setIsOpen(true);
    }
  }, [isActive, item.subItems]);

  // Handle click outside
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

    if (subItem.permission && !hasPermission(subItem.permission)) {
      console.log(`Access Denied: ${subItem.name} requires ${subItem.permission}`);
      return;
    }
   
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
        {hasSubItems && visibleSubItems.length > 0 && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ease-in-out
              ${isOpen ? 'transform rotate-180' : ''}
            `}
          />
        )}
      </button>
      
      {hasSubItems && visibleSubItems.length > 0 && (
        <div
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
            relative z-10
          `}
        >
          <div className="pl-4 space-y-1 py-1">
            {visibleSubItems.map((subItem, index) => {
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