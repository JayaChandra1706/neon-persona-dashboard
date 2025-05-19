
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  variant?: 'default' | 'cyan' | 'magenta';
  className?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  variant = 'default',
  className,
  children,
  actions
}) => {
  return (
    <div 
      className={cn(
        'card card-hover p-5',
        variant === 'cyan' && 'card-cyan',
        variant === 'magenta' && 'card-magenta',
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={cn(
          'font-bold text-lg',
          variant === 'cyan' && 'neon-text-cyan',
          variant === 'magenta' && 'neon-text-magenta'
        )}>
          {title}
        </h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default DashboardCard;
