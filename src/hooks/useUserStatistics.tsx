
import { useState, useEffect, useMemo } from 'react';
import { mangaAPI } from '@/services/apiService';
import { useManga } from '@/context/MangaContext';
import { UserManga, ReadingStatus } from '@/types/manga';

export interface StatisticsData {
  totalMangas: number;
  readingCount: number;
  completedCount: number;
  planToReadCount: number;
  droppedCount: number;
  
  totalChapters: number;
  avgRating: number;
  genres: { name: string; count: number }[];
  types: { name: string; count: number }[];
  readingStatusData: { name: string; value: number; color: string }[];
}

export function useUserStatistics() {
  const { mangaCollection } = useManga();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StatisticsData | null>(null);
  // Dados sempre locais
  const [isUsingApi] = useState(false);
  const apiData = mangaCollection;

  useEffect(() => {
    setLoading(false);
  }, []);

  // Calcular estatísticas baseadas na fonte de dados apropriada
  const statistics = useMemo(() => {
    const mangas = isUsingApi ? apiData : mangaCollection;

    if (!mangas || mangas.length === 0) {
      return {
        totalMangas: 0,
        readingCount: 0,
        completedCount: 0,
        planToReadCount: 0,
        droppedCount: 0,
        
        totalChapters: 0,
        avgRating: 0,
        genres: [],
        types: [],
        readingStatusData: [],
      };
    }
    
    // Contagem de status
    const totalMangas = mangas.length;
    const readingCount = mangas.filter(m => m.readingStatus === 'lendo').length;
    const completedCount = mangas.filter(m => m.readingStatus === 'completo').length;
    const planToReadCount = mangas.filter(m => m.readingStatus === 'planejo_ler').length;
    const droppedCount = mangas.filter(m => m.readingStatus === 'abandonado').length;
    
    
    // Calcular total de capítulos e média de avaliações
    let totalChapters = 0;
    let totalRating = 0;
    let ratedCount = 0;
    
    mangas.forEach(manga => {
      if (manga.lastReadChapter) {
        totalChapters += manga.lastReadChapter;
      }
      
      if (manga.rating) {
        totalRating += manga.rating;
        ratedCount++;
      }
    });
    
    const avgRating = ratedCount > 0 ? +(totalRating / ratedCount).toFixed(1) : 0;
    
    // Dados para o gráfico de status
    const readingStatusData = [
      { name: 'Lendo', value: readingCount, color: '#8B5CF6' },
      { name: 'Completo', value: completedCount, color: '#10B981' },
      { name: 'Planejo Ler', value: planToReadCount, color: '#0EA5E9' },
      { name: 'Abandonado', value: droppedCount, color: '#6B7280' },
      
    ].filter(item => item.value > 0);
    
    // Contagem de gêneros
    const genreCounts: Record<string, number> = {};
    mangas.forEach(manga => {
      manga.genres?.forEach(genre => {
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
    });
    
    const genres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Contagem de tipos de mangá
    const typeCounts: Record<string, number> = {};
    mangas.forEach(manga => {
      const type = manga.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const types = Object.entries(typeCounts)
      .map(([name, count]) => ({ 
        name: name === 'manga' ? 'Mangá' : name === 'manhwa' ? 'Manhwa' : 'Webtoon', 
        count 
      }))
      .sort((a, b) => b.count - a.count);
      
    return {
      totalMangas,
      readingCount,
      completedCount,
      planToReadCount,
      droppedCount,

      totalChapters,
      avgRating,
      genres,
      types,
      readingStatusData,
    };
  }, [mangaCollection, apiData, isUsingApi]);
  
  // Atualizar dados quando as estatísticas mudarem
  useEffect(() => {
    setData(statistics);
  }, [statistics]);
  
  return {
    data,
    loading,
    error,
    isUsingApi,
    refresh: async () => {
  setLoading(true);
  try {
    // Atualiza dados locais
    setData(statistics);
  } catch (err) {
    setError("Erro ao atualizar estatísticas.");
  } finally {
    setLoading(false);
  }
}
  };
}
