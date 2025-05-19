
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { state } = useAppContext();

  // Toggle sidebar collapse
  const handleToggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  // Set document body class for dark mode
  useEffect(() => {
    document.body.classList.toggle('dark', state.isDarkMode);
  }, [state.isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />
      
      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-150 ease-in",
          isMobile 
            ? "pb-16" // Space for bottom navigation 
            : collapsed 
              ? "ml-16" 
              : "ml-64"
        )}
      >
        <div className="container mx-auto p-4 animate-fade-in">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
