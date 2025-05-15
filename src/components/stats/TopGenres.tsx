
import React from 'react';

interface GenreItem {
  name: string;
  count: number;
}

interface TopGenresProps {
  genres: GenreItem[];
}

const TopGenres: React.FC<TopGenresProps> = ({ genres }) => {
  // Cores para diferentes gêneros para melhorar a visualização
  const genreColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
  ];
  
  return (
    <div className="bg-black/80 dark:bg-black/90 p-4 rounded-lg border border-gray-800 shadow-sm">
      <div className="space-y-4">
        {genres.length > 0 ? (
          genres.map((genre, index) => (
            <div key={genre.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{genre.name}</span>
                <span className="text-muted-foreground">{genre.count}</span>
              </div>
              <div className="w-full bg-gray-800 dark:bg-gray-900 rounded-full h-2.5">
                <div 
                  className={`${genreColors[index % genreColors.length]} h-2.5 rounded-full`}
                  style={{ 
                    width: `${(genre.count / (genres[0]?.count || 1)) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">Nenhum gênero encontrado</p>
        )}
      </div>
    </div>
  );
};

export default TopGenres;
