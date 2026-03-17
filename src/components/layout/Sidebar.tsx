import React from 'react';
import { Home, Dumbbell, Calendar, BarChart2, User, X } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentRoute, 
  setCurrentRoute, 
  isOpen,
  closeSidebar
}) => {
  const navItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, route: 'dashboard' },
    { name: 'Workouts', icon: <Dumbbell className="w-5 h-5" />, route: 'workouts' },
    { name: 'Planner', icon: <Calendar className="w-5 h-5" />, route: 'planner' },
    { name: 'Analytics', icon: <BarChart2 className="w-5 h-5" />, route: 'analytics' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, route: 'profile' },
  ];

  const handleNavClick = (route: string) => {
    setCurrentRoute(route);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } bg-white dark:bg-gray-800 shadow-lg md:shadow-none flex-shrink-0 pt-16 md:pt-20`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Close button for mobile */}
          <div className="flex justify-end md:hidden">
            <button 
              className="p-2 rounded-md text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              onClick={closeSidebar}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.route}>
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      currentRoute === item.route
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleNavClick(item.route)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer information */}
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 py-4 mt-auto">
            <p>FitTrack Pro v1.0</p>
            <p className="mt-1">© 2025 FitTrack</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;