import React, { useEffect, useRef, useState } from 'react';
import { 
  MoreVertical, 
  UserCog, 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle,
  Trash2,
  Mail,
  AlertTriangle
} from 'lucide-react';

const UserActionsMenu = ({ 
  user, 
  onEdit, 
  onDelete, 
  onResetPassword, 
  onToggleStatus,
  onManageRoles,
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: 'Edit User',
      icon: UserCog,
      onClick: () => {
        onEdit(user);
        setIsOpen(false);
      },
      color: 'text-gray-700'
    },
    {
      label: 'Manage Roles',
      icon: Shield,
      onClick: () => {
        onManageRoles(user);
        setIsOpen(false);
      },
      color: 'text-blue-600'
    },
    {
      label: 'Reset Password',
      icon: Key,
      onClick: () => {
        onResetPassword(user);
        setIsOpen(false);
      },
      color: 'text-orange-600'
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: () => {
        window.location.href = `mailto:${user.email}`;
        setIsOpen(false);
      },
      color: 'text-gray-700'
    },
    {
      type: 'divider'
    },
    {
      label: user.isActive ? 'Deactivate User' : 'Activate User',
      icon: user.isActive ? XCircle : CheckCircle,
      onClick: () => {
        onToggleStatus(user);
        setIsOpen(false);
      },
      color: user.isActive ? 'text-red-600' : 'text-green-600'
    },
    {
      type: 'divider'
    },
    {
      label: 'Delete User',
      icon: Trash2,
      onClick: () => {
        onDelete(user);
        setIsOpen(false);
      },
      color: 'text-red-600',
      className: 'hover:bg-red-50'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asyv-green"
      >
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div 
            className={`absolute z-50 ${
              position === 'right' ? 'right-0' : 'left-0'
            } mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
          >
            <div className="py-1" role="menu">
              {menuItems.map((item, index) => (
                item.type === 'divider' ? (
                  <div 
                    key={`divider-${index}`} 
                    className="border-t border-gray-100 my-1"
                  />
                ) : (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`
                      w-full px-4 py-2 text-sm flex items-center space-x-2
                      ${item.color} hover:bg-gray-50
                      ${item.className || ''}
                    `}
                    role="menuitem"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserActionsMenu;