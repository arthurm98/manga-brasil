
import React from 'react';
import { Card } from "@/components/ui/card";

interface CollectionSummaryProps {
  totalMangas: number;
  currentlyReading: number;
  completed: number;
  
  planToRead: number;
  statusPercentage: {
    reading: number;
    completed: number;
    
    planned: number;
  };
  avgRating: string | number;
}

const CollectionSummary: React.FC<CollectionSummaryProps> = ({
  totalMangas,
  currentlyReading,
  completed,
  
  planToRead,
  statusPercentage,
  avgRating
}) => {
  return (
    <Card className="p-6 bg-black dark:bg-gray-900 border shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-foreground">Resumo da Coleção</h3>
      
      <div className="space-y-4 text-sm md:text-base text-muted-foreground">
        <p className="leading-relaxed">
          Sua coleção tem um total de <span className="font-medium text-foreground">{totalMangas} títulos</span>, 
          dos quais você está lendo ativamente <span className="font-medium text-foreground">{currentlyReading} ({statusPercentage.reading}%)</span> e 
          já completou <span className="font-medium text-foreground">{completed} ({statusPercentage.completed}%)</span>.
        </p>
        
        <p className="leading-relaxed">
          
          e planeja ler <span className="font-medium text-foreground">{planToRead} novos títulos</span> no futuro.
        </p>
        
        <p className="leading-relaxed">
          A média de avaliação da sua coleção é <span className="font-medium text-foreground">{avgRating}/5</span>.
        </p>
      </div>
    </Card>
  );
};

export default CollectionSummary;
