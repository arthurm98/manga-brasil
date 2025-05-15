
import React from 'react';
import { UserManga } from '../types/manga';
import MangaCard from './MangaCard';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface MangaGridProps {
  mangas: UserManga[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onAddToLibrary?: (manga: UserManga) => void;
  inLibraryIds?: string[];
}

const MangaGrid: React.FC<MangaGridProps> = ({ 
  mangas, 
  title, 
  emptyMessage = "Nenhum mangá encontrado", 
  className,
  onRetry,
  isLoading = false,
  isError = false,
  errorMessage = "Ocorreu um erro ao carregar os mangás.",
  onAddToLibrary,
  inLibraryIds = [],
}) => {
  const navigate = useNavigate();

  const handleMangaClick = (id: string, mangaObj?: UserManga) => {
    // Se mangaObj for fornecido, passar via state
    if (mangaObj) {
      navigate(`/manga/${id}`, { state: { manga: mangaObj } });
    } else {
      navigate(`/manga/${id}`);
    }
  };

  if (isError) {
    return (
      <div className={className}>
        {title && <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>}
        <Alert className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {title && <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-200 animate-pulse h-64 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
      )}
      
      {mangas.length === 0 ? (
        <div className="flex justify-center items-center h-40 bg-muted rounded-lg text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mangas.map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              onDoubleClick={() => handleMangaClick(manga.id, manga)}
              onAddToLibrary={onAddToLibrary ? () => onAddToLibrary(manga) : undefined}
              isInLibrary={inLibraryIds.includes(manga.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MangaGrid;
