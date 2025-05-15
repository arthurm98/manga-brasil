import React, { useState, useEffect } from 'react';
import { useManga } from '../context/MangaContext';
import { useApiSearch } from '@/hooks/useApiSearch';
import MangaGrid from '../components/MangaGrid';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X as ClearIcon, Info as InfoIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Manga, UserManga } from '../types/manga';

const SearchPage: React.FC = () => {
  const { mangaCollection, searchManga, addManga } = useManga();
  const apiSearch = useApiSearch();
  const { toast } = useToast();
  const [query, setQuery] = useState<string>('');
  // Resultados podem ser UserManga[] (coleção local) ou Manga[] (busca online)
  const [results, setResults] = useState<Manga[] | UserManga[]>(mangaCollection);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'collection' | 'online'>('collection');
  const [searchSource, setSearchSource] = useState<string>('auto'); // auto, kitsu, jikan, mangadex, anilist

  // Sincronizar resultados com a coleção de mangás quando ela mudar
  useEffect(() => {
    if ((!hasSearched || !query.trim()) && activeTab === "collection") {
      setResults(mangaCollection);
    }
  }, [mangaCollection, hasSearched, query, activeTab]);
  
  
  
  // Handler de busca principal
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
  if (activeTab === "collection") {
    setResults(mangaCollection);
  } else {
    setResults([]);
  }
  setHasSearched(false);
  return;
}
    
    setIsSearching(true);
    setHasSearched(true);
    setError(null);
    
    try {
      if (activeTab === "collection") {
        console.log(`Buscando na coleção: "${query}"`);
        const searchResults: UserManga[] = searchManga(query);
        setResults(searchResults);
        
        if (searchResults.length === 0) {
          toast({
            title: "Nenhum resultado encontrado",
            description: `Não encontramos mangás para "${query}". Tente outros termos.`,
          });
        }
      } else {
        console.log(`Buscando online: "${query}" (fonte: ${searchSource})`);
        const apiResults: Manga[] = await apiSearch.searchManga(query);
        setResults(apiResults);
      }
    } catch (error) {
      console.error("Erro ao realizar a busca:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao buscar mangás");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Atualiza query e limpa resultados se vazio
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Limpar resultados quando o campo estiver vazio
    if (!newQuery.trim()) {
      if (activeTab === "collection") {
        setResults(mangaCollection);
      } else {
        setResults([]);
      }
      setHasSearched(false);
      setError(null);
    }
  };
  
  // Limpa o campo de busca e resultados
  const handleClearSearch = () => {
    setQuery('');
    if (activeTab === "collection") {
      setResults(mangaCollection);
    
    } else {
      setResults([]);
    }
    setHasSearched(false);
    setError(null);
  };
  
  
  
  // Troca de aba (coleção/online)
  const handleTabChange = async (value: 'collection' | 'online') => {
    setActiveTab(value);
    setHasSearched(false);
    setError(null);
    
    if (value === "collection") {
      setResults(mangaCollection);
    
    } else {
      // Tab de busca online
      if (query.trim()) {
        setIsSearching(true);
        try {
           const searchResults: Manga[] = await apiSearch.searchManga(query);
           setResults(searchResults);
          setHasSearched(true);
        } catch (error) {
          setError("Erro ao realizar busca online. Tente novamente.");
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }
  };

  // Certifique-se de que todas as funções acima estão fechadas corretamente antes deste return!

  // Mensagem para grid vazio
  const getEmptyMessage = () => {
    if (isSearching) return "Buscando...";
    
    if (activeTab === "collection") {
      return hasSearched && query.trim() !== '' 
        ? `Nenhum mangá encontrado para "${query}". Tente outros termos de busca.` 
        : "Sua coleção está vazia. Adicione alguns mangás para começar.";
    } else {
      return hasSearched && query.trim() !== '' 
        ? `Nenhum mangá encontrado online para "${query}". Tente outros termos de busca.`
        : "Faça uma busca para encontrar mangás online";
    }
  };

  // Função para adicionar mangá à biblioteca
  // Adiciona mangá online à coleção
  const handleAddToLibrary = (manga: Manga) => {
    if (mangaCollection.some((m) => m.id === manga.id)) {
      toast({
        title: "Mangá já está na sua biblioteca",
        description: `O mangá '${manga.title}' já foi adicionado.`,
        variant: "default",
      });
      return;
    }
    const now = new Date();
    const userManga = {
      id: manga.id,
      title: manga.title ?? 'Sem título',
      type: manga.type ?? 'manga',
      cover: manga.cover ?? '',
      author: manga.author ?? 'Desconhecido',
      artist: manga.artist ?? '',
      status: manga.status ?? 'em_andamento',
      description: manga.description ?? '',
      genres: manga.genres ?? [],
      totalChapters: typeof manga.totalChapters === 'number' ? manga.totalChapters : (manga.totalChapters ? Number(manga.totalChapters) : null),
      publishYear: manga.publishYear ?? now.getFullYear(),
      publisher: manga.publisher ?? '',
      readingStatus: 'planejo_ler',
      lastReadChapter: 0,
      rating: null,
      dateAdded: now,
      lastUpdated: now,
      notes: '',
    };
    addManga(userManga, "planejo_ler");
    toast({
      title: "Mangá adicionado à biblioteca!",
      description: `O mangá '${userManga.title}' foi adicionado à sua coleção.`,
      variant: "default",
    });
  };

  return (
    <div className="page-container animate-fade-in">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
  <TabsTrigger value="collection">Minha Coleção</TabsTrigger>
  <TabsTrigger value="online">Buscar Online</TabsTrigger>
</TabsList>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          value={query}
          onChange={handleQueryChange}
          placeholder={
            activeTab === 'online'
              ? 'Buscar mangá online...'
              : 'Buscar na coleção...'}
          className="flex-1"
        />
        <Button type="submit" variant="default" aria-label="Buscar">
          <SearchIcon className="w-4 h-4" />
        </Button>
        {query && (
          <Button type="button" variant="ghost" onClick={handleClearSearch} aria-label="Limpar busca">
            <ClearIcon className="w-4 h-4" />
          </Button>
        )}
      </form>

      {!error && hasSearched && query.trim() !== '' && (
        <div className="mb-4 text-sm flex items-center gap-2 text-muted-foreground">
          <InfoIcon className="h-4 w-4" />
          <span>Exibindo resultados para: <strong>"{query}"</strong></span>
        </div>
      )}

      

      <MangaGrid
        mangas={results}
        title={
          activeTab === "collection"
            ? "Minha Coleção"
            : activeTab === "online"
            ? "Resultados Online"
             : ""
        }
        emptyMessage={getEmptyMessage()}
        isLoading={isSearching}
        isError={!!error}
        errorMessage={error || undefined}
        onAddToLibrary={activeTab === "online" ? handleAddToLibrary : undefined}
        inLibraryIds={mangaCollection.map(m => m.id)}
      />
    </Tabs>
  </div>
  );
};

export default SearchPage;
