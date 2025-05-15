import { useState } from 'react';
import { searchMALManga } from '../integrations/mal/api';
import { MALManga } from '../integrations/mal/types';

export function useMALSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MALManga[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function search(query: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMALManga(query);
      setResults(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar no MyAnimeList');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { loading, results, error, search };
}
