
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  className, 
  icon 
}) => (
  <Card className={`overflow-hidden transition-all hover:shadow-md ${className}`}>
    <CardContent className="pt-6 px-4 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-2xl font-bold mb-1">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground bg-muted/30 p-2 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
