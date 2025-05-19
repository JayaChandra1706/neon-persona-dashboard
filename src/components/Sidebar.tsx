
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Wallet, Heart, Dumbbell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the navigation items
const navItems = [
  {
    id: 'experiences',
    label: 'Experiences',
    icon: Activity,
    path: '/'
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    path: '/finance'
  },
  {
    id: 'health',
    label: 'Health',
    icon: Heart,
    path: '/health'
  },
  {
    id: 'gym',
    label: 'Gym',
    icon: Dumbbell,
    path: '/gym'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { state } = useAppContext();
  const isMobile = useIsMobile();

  // Don't render sidebar on mobile - we'll use bottom nav instead
  if (isMobile) return null;

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-150 ease-in border-r border-sidebar-border z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan to-magenta mr-3"></div>
              <span className="text-lg font-semibold text-white">Pulse</span>
            </div>
          )}
          
          <button 
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              {collapsed ? (
                <path d="M6 11L10 7.5L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M9 11L5 7.5L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center p-3 rounded-md transition-colors relative group",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("flex-shrink-0", isActive ? "text-cyan" : "")} size={20} />
                      
                      {!collapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                      
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile Section */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={state.profile.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{state.profile.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
