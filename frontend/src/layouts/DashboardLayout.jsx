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
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = item.href === location.pathname ||
          item.subItems?.some(subItem => subItem.href === location.pathname);

        return (
          <CollapsibleNavItem
            key={item.name}
            item={item}
            isActive={isActive}
            onCloseSidebar={() => setSidebarOpen(false)}
          />
        );
      })}
    </nav>
  );

  const SidebarContent = () => (
    <div className="h-0 flex-1 flex flex-col">
      <NavigationSection />
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
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1">
            {/* Sidebar Header */}
            <div className="flex h-16 flex-shrink-0 items-center bg-asyv-green px-4">
              <LogoSection />
            </div>
            
            {/* Sidebar Content */}
            <div className="flex flex-1 flex-col overflow-y-auto bg-asyv-green-dark">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? '' : 'pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 ${
            sidebarOpen ? 'opacity-75' : 'opacity-0'
          } transition-opacity duration-300`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-asyv-green-dark transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
        >
          <div className="flex h-16 flex-shrink-0 items-center justify-between bg-asyv-green px-4">
            <LogoSection />
            <button
              className="text-white hover:text-asyv-orange"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav */}
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-asyv-green lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-between px-4">
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

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;