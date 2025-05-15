
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Manga, UserManga, ReadingStatus } from '../types/manga';
import { mockMangaData } from '../data/mockData';

import { libraryService } from '@/services/libraryService';

/**
 * Interface do contexto de mangá, incluindo métodos para manipulação da coleção
 * Agora inclui updateType para edição do tipo do mangá.
 */
interface MangaContextType {
  mangaCollection: UserManga[];
  recentlyUpdated: UserManga[];

  currentlyReading: UserManga[];
  planToRead: UserManga[];
  completed: UserManga[];
  addManga: (manga: Manga, status: ReadingStatus) => void;
  updateReadingStatus: (id: string, status: ReadingStatus) => void;
  updateReadChapter: (id: string, chapter: number) => void;
  setRating: (id: string, rating: number) => void;
  getMangaById: (id: string) => UserManga | undefined;
  searchManga: (query: string) => UserManga[];
  /**
   * Atualiza o tipo do mangá (manga, manhwa, webtoon)
   * @param id ID do mangá
   * @param type Novo tipo
   */
  updateType: (id: string, type: 'manga' | 'manhwa' | 'webtoon') => void;
  loading: boolean;
  exportCollection: () => string;
  importCollection: (json: string) => boolean;
  removeManga: (id: string) => void;
  updateSynopsis: (id: string, synopsis: string) => void;
  updateCover: (id: string, coverUrl: string) => void;
}

const MangaContext = createContext<MangaContextType | undefined>(undefined);

// Função utilitária agora em utils/dateUtils.ts
import { parseUserMangaDates } from '../lib/dateUtils';

import { toast } from 'sonner';

export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangaCollection, setMangaCollection] = useState<UserManga[]>(() => {
    // Carregar do LocalStorage ao inicializar
    try {
      const stored = localStorage.getItem('manga_collection');
      if (stored) {
        return parseUserMangaDates(JSON.parse(stored));
      }
      // Garante que o mock sempre seja UserManga[]
      return parseUserMangaDates(mockMangaData as Partial<UserManga>[]);
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Persistir no LocalStorage sempre que mangaCollection mudar
  useEffect(() => {
    libraryService.saveAll(mangaCollection);
  }, [mangaCollection]);

  // Carregar coleção local ao iniciar
  useEffect(() => {
    setLoading(false);
  }, []);


  const currentlyReading = mangaCollection.filter(manga => manga.readingStatus === 'lendo');
  const planToRead = mangaCollection.filter(manga => manga.readingStatus === 'planejo_ler');
  const completed = mangaCollection.filter(manga => manga.readingStatus === 'completo');
  
  // Ordenados por data de atualização
  const recentlyUpdated = [...mangaCollection].sort((a, b) => {
    // Garante que lastUpdated é Date
    const dateA = a.lastUpdated instanceof Date ? a.lastUpdated : new Date(a.lastUpdated);
    const dateB = b.lastUpdated instanceof Date ? b.lastUpdated : new Date(b.lastUpdated);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 6);

  const addManga = useCallback((manga: Manga, status: ReadingStatus) => {
    const userManga: UserManga = {
      ...manga,
      readingStatus: status,
      lastReadChapter: 0,
      dateAdded: new Date(),
      lastUpdated: new Date(),
    };
    setMangaCollection(prev => {
      // Evitar duplicatas
      if (prev.some(m => m.id === userManga.id)) return prev;
      const novaColecao = [...prev, userManga];
      libraryService.saveAll(novaColecao);
      return novaColecao;
    });
  }, []);

  const updateReadingStatus = useCallback((id: string, status: ReadingStatus) => {
    setMangaCollection(prev =>
      prev.map(manga =>
        manga.id === id
          ? { ...manga, readingStatus: status, lastUpdated: new Date() }
          : manga
      )
    );
  }, []);

  const updateReadChapter = useCallback((id: string, chapter: number) => {
    setMangaCollection(prev =>
      prev.map(manga =>
        manga.id === id
          ? { ...manga, lastReadChapter: chapter, lastUpdated: new Date() }
          : manga
      )
    );
  }, []);

  const setRating = useCallback((id: string, rating: number) => {
    setMangaCollection(prev =>
      prev.map(manga =>
        manga.id === id
          ? { ...manga, rating, lastUpdated: new Date() }
          : manga
      )
    );
  }, []);

  const getMangaById = useCallback((id: string) => {
    return mangaCollection.find(manga => manga.id === id);
  }, [mangaCollection]);

  // Função de busca aprimorada
  const searchManga = useCallback((query: string): UserManga[] => {
    if (!query || query.trim() === '') {
      return mangaCollection;
    }
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    console.log("Realizando busca pelos termos:", searchTerms);
    
    try {
      const results = mangaCollection.filter(manga => {
        // Verifica cada termo de busca separadamente
        return searchTerms.some(term => {
          // Título
          const titleMatch = manga.title ? 
            manga.title.toLowerCase().includes(term) : false;
          
          // Autor
          const authorMatch = manga.author ? 
            manga.author.toLowerCase().includes(term) : false;
          
          // Gêneros - verifica cada gênero individualmente
          const genreMatch = manga.genres && manga.genres.length > 0 ? 
            manga.genres.some(genre => genre.toLowerCase().includes(term)) : false;
          
          // Descrição
          const descriptionMatch = manga.description ? 
            manga.description.toLowerCase().includes(term) : false;
            
          // Artista
          const artistMatch = manga.artist ? 
            manga.artist.toLowerCase().includes(term) : false;
            
          return titleMatch || authorMatch || genreMatch || descriptionMatch || artistMatch;
        });
      });
      
      console.log(`Busca por "${query}" encontrou ${results.length} resultados`);
      return results;
    } catch (error) {
      console.error("Erro na busca de mangás:", error);
      throw new Error(`Falha ao realizar busca: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [mangaCollection]);

  // Exportar coleção como JSON
  const exportCollection = useCallback((): string => {
    try {
      const json = libraryService.exportToJson();
      toast.success('Coleção exportada com sucesso!');
      return json;
    } catch {
      toast.error('Erro ao exportar coleção.');
      return '';
    }
  }, []);

  // Importar coleção do JSON
  const importCollection = useCallback((json: string): boolean => {
    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        const parsed = parseUserMangaDates(arr);
        setMangaCollection(parsed);
        libraryService.saveAll(parsed); // Salva no localStorage também
        toast.success('Coleção importada com sucesso!');
        return true;
      }
      toast.error('Arquivo inválido para importação.');
      return false;
    } catch {
      toast.error('Erro ao importar coleção.');
      return false;
    }
  }, []);

  // Remover mangá da coleção
  const removeManga = useCallback((id: string) => {
    setMangaCollection(prev => {
      const novaColecao = prev.filter(m => m.id !== id);
      libraryService.saveAll(novaColecao);
      toast.success('Mangá removido da biblioteca!');
      return novaColecao;
    });
  }, []);

  // Editar sinopse de um mangá
  const updateSynopsis = useCallback((id: string, synopsis: string) => {
    setMangaCollection(prev => prev.map(m =>
      m.id === id ? { ...m, description: synopsis, lastUpdated: new Date() } : m
    ));
    setTimeout(() => {
      const atualizada = libraryService.getAll().map(m =>
        m.id === id ? { ...m, description: synopsis, lastUpdated: new Date() } : m
      );
      libraryService.saveAll(atualizada);
    }, 0);
  }, []);

  // Atualizar capa
  const updateCover = useCallback((id: string, coverUrl: string) => {
    setMangaCollection(prev => prev.map(m =>
      m.id === id ? { ...m, cover: coverUrl, lastUpdated: new Date() } : m
    ));
    setTimeout(() => {
      const atualizada = libraryService.getAll().map(m =>
        m.id === id ? { ...m, cover: coverUrl, lastUpdated: new Date() } : m
      );
      libraryService.saveAll(atualizada);
    }, 0);
  }, []);

  return (
    <MangaContext.Provider
      value={{
        mangaCollection,
        recentlyUpdated,
        currentlyReading,
        planToRead,
        completed,
        addManga,
        updateReadingStatus,
        updateReadChapter,
        setRating,
        getMangaById,
        searchManga,
        /**
         * Atualiza o tipo do mangá na coleção e persiste a alteração.
         * Também atualiza o campo lastUpdated.
         */
        updateType: (id, type) => {
          setMangaCollection(prev => prev.map(manga =>
            manga.id === id ? { ...manga, type, lastUpdated: new Date() } : manga
          ));
          setTimeout(() => {
            const atualizada = libraryService.getAll().map(manga =>
              manga.id === id ? { ...manga, type, lastUpdated: new Date() } : manga
            );
            libraryService.saveAll(atualizada);
          }, 0);
        },
        loading,
        exportCollection,
        importCollection,
        removeManga,
        updateSynopsis,
        updateCover,
      }}
    >
      {children}
    </MangaContext.Provider>
  );
};

export const useManga = () => {
  const context = useContext(MangaContext);
  if (context === undefined) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};
