import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  currentRoute: string;
  setCurrentRoute: (route: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, setCurrentRoute }) => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar 
          currentRoute={currentRoute} 
          setCurrentRoute={setCurrentRoute} 
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 pt-20 transition-all duration-200 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;