import { useState } from 'react';
import { searchAniListManga } from '../integrations/anilist/api';
import { AniListManga } from '../integrations/anilist/types';

export function useAniListSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AniListManga[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function search(query: string) {
    setLoading(true);
    setError(null);
    try {
      const manga = await searchAniListManga(query);
      setResults(manga ? [manga] : []);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar no AniList');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { loading, results, error, search };
}
