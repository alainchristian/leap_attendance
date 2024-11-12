import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/auth.context';
import { navigation } from '../config/navigation';
import AsyvAvatar from '../components/avatars/AsyvAvatar';
import UserProfileDropdown from '../components/user/UserProfileDropdown';
import CollapsibleNavItem from '../components/navigation/CollapsibleNavItem';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter(item => {
    // If no permission required or has permission
    if (!item.permission || hasPermission(item.permission)) {
      // If item has subitems, filter them too
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(
          subItem => !subItem.permission || hasPermission(subItem.permission)
        );
        // Only include item if it has visible subitems
        return filteredSubItems.length > 0;
      }
      return true;
    }
    return false;
  });

  const SearchBar = () => (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                 text-gray-900 placeholder-gray-500 focus:border-asyv-green focus:ring-0
                 focus:outline-none text-sm transition duration-150 ease-in-out"
      />
    </div>
  );

  const LogoSection = () => (
    <div className="flex items-center">
      <AsyvAvatar
        size="md"
        className="border-2 border-white"
      />
      <span className="ml-2 text-white font-semibold">ASYV LEAP</span>
    </div>
  );

  const NavigationSection = () => (
    <div className="px-2 py-4 space-y-1">
      {filteredNavigation.map((item) => {
        // Check if this item or any of its subitems matches current path
        const isActive = item.href === location.pathname ||
          item.subItems?.some(subItem => subItem.href === location.pathname);

        return (
          <CollapsibleNavItem
            key={item.name}
            item={{
              ...item,
              // Filter subItems based on permissions
              subItems: item.subItems?.filter(
                subItem => !subItem.permission || hasPermission(subItem.permission)
              )
            }}
            isActive={isActive}
            onCloseSidebar={() => setSidebarOpen(false)}
          />
        );
      })}
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-y-auto pt-1">
        <NavigationSection />
      </div>
      <div className="flex-shrink-0 flex border-t border-asyv-green p-4">
        <div className="flex items-center w-full">
          <AsyvAvatar
            user={user}
            size="md"
            className="border-2 border-white"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
            <button
              onClick={logout}
              className="flex items-center text-xs text-asyv-green-light hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-asyv-green-dark transition duration-300 ease-in-out lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo section */}
        <div className="flex h-16 items-center justify-between px-4 bg-asyv-green">
          <LogoSection />
          <button
            className="lg:hidden text-white hover:text-asyv-orange"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:pl-64">
        {/* Top navigation */}
        <div className="flex-shrink-0 h-16 bg-white shadow-sm flex items-center">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-asyv-green lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <SearchBar />
            <div className="ml-4 flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-asyv-green focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <div className="border-l border-gray-200 h-6" />
              <UserProfileDropdown user={user} onLogout={logout} />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;