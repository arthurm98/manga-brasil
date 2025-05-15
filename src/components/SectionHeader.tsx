
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
  children
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between mb-4", className)}>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center mt-2 md:mt-0 space-x-2">
        {children}
        
        {action && (
          action.to ? (
            <Button variant="link" asChild className="p-0 text-manga hover:text-manga-dark">
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant="link" className="p-0 text-manga hover:text-manga-dark" onClick={action.onClick}>
              {action.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
