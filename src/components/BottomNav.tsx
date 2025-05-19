
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Wallet, Heart, Dumbbell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the navigation items (same as sidebar)
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

const BottomNav = () => {
  const isMobile = useIsMobile();
  
  // Only render on mobile devices
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-20">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-1 flex-1 transition-colors",
              isActive ? "text-cyan" : "text-sidebar-foreground hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
