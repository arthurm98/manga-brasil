
import { useState, useCallback } from 'react';
import { mangaAPI } from '@/services/apiService';
import { Manga } from '@/types/manga';
import { useToast } from '@/hooks/use-toast';

export function useApiSearch() {
  const [results, setResults] = useState<Partial<Manga>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const searchManga = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return [];
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const { data: searchResults, error: searchError } = await mangaAPI.search(query);
      setResults(Array.isArray(searchResults) ? searchResults : []);

      if (searchError) {
        let userMessage = "Erro ao buscar mangás online.";
        if (searchError.includes('status 429') || searchError.toLowerCase().includes('rate')) {
          userMessage = "Limite de requisições atingido (rate limit). Aguarde alguns minutos e tente novamente.";
        } else if (searchError.includes('Kitsu')) {
          userMessage = "A API principal (Kitsu) está indisponível. Tentando fallback...";
        } else if (searchError.includes('Jikan')) {
          userMessage = "A API secundária (Jikan) está indisponível. Tentando fallback...";
        } else if (searchError.includes('MangaDex')) {
          userMessage = "A API MangaDex está indisponível. Nenhuma API retornou resultados.";
        }
        toast({
          title: "Erro na busca",
          description: userMessage,
          variant: "destructive",
        });
      }

      if (searchResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: `Não encontramos mangás para "${query}". Tente outros termos.`,
          variant: "default",
        });
      } else {
        let fonte = 'API desconhecida';
        if (!searchError) fonte = 'Kitsu';
        else if (searchError.includes('Kitsu')) fonte = 'Jikan';
        else if (searchError.includes('Jikan')) fonte = 'MangaDex';
        toast({
          title: "Busca concluída",
          description: `Encontramos ${searchResults.length} mangá(s) para "${query}" (Fonte: ${fonte}).`,
          variant: "default",
        });
      }

      return searchResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na busca';
      setError(errorMessage);
      
      toast({
        title: "Erro ao buscar mangás",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [toast]);
  
  const getPopular = useCallback(async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      const popularResults = await mangaAPI.popular();
      setResults(popularResults);
      
      if (popularResults.length === 0) {
        toast({
          title: "Sem resultados",
          description: "Não foi possível carregar mangás populares neste momento.",
          variant: "default",
        });
      }
      
      return popularResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar mangás populares';
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar populares",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [toast]);
  
  return {
    results,
    isSearching,
    error,
    searchManga,
    getPopular
  };
}
