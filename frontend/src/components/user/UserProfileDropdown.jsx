import React, { useState, useRef, useEffect } from 'react';
import { 
  LogOut,
  User,
  Settings,
  Key,
  HelpCircle,
  UserCircle,
  ChevronDown
} from 'lucide-react';
import AsyvAvatar from '../avatars/AsyvAvatar';  // Fixed import path
const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      icon: UserCircle,
      label: 'My Profile',
      onClick: () => console.log('Profile clicked'),
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      icon: Key,
      label: 'Change Password',
      onClick: () => console.log('Change password clicked'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => console.log('Help clicked'),
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: onLogout,
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-4 focus:outline-none"
      >
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
        </div>
        <div className="flex items-center space-x-2">
          <AsyvAvatar 
            user={user} 
            size="md" 
            showStatus={true}
            className="border-2 border-asyv-green-light" 
          />
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick();
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-sm
                      flex items-center space-x-2
                      hover:bg-gray-50
                      ${item.className || 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;