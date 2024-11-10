import React, { useState } from 'react';
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

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const { user, logout } = useAuth();

  const handleNavigation = (itemName) => {
    setActiveNavItem(itemName);
    // Only close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
      {navigation.map((item) => (
        <CollapsibleNavItem
          key={item.name}
          item={item}
          isActive={activeNavItem === item.name}
          onNavigate={handleNavigation}
        />
      ))}
    </div>
  );

  const SidebarContent = () => (
    <>
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
            <p className="text-sm font-medium text-white"> {user ? `${user.firstName} ${user.lastName}` : ''}</p>
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
    </>
  );


  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          ${sidebarOpen ? 'visible' : 'invisible'}
          transition-all duration-300
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            fixed inset-0 bg-gray-600
            ${sidebarOpen ? 'bg-opacity-75' : 'bg-opacity-0'}
            transition-opacity duration-300
          `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`
            fixed inset-y-0 left-0 flex flex-col w-full max-w-xs sm:max-w-sm
            bg-asyv-green-dark transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between h-16 px-4 bg-asyv-green">
            <LogoSection />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-asyv-orange focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-asyv-green-dark">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-asyv-green">
              <LogoSection />
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-asyv-green lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex items-center justify-between">
            <SearchBar />

            <div className="ml-4 flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-asyv-green focus:outline-none">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="border-l border-gray-200 h-6" />
              <UserProfileDropdown user={user} onLogout={logout} />
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;