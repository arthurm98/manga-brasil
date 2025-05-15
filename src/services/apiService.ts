
import { Manga, UserManga, MangaType, MangaStatus, ReadingStatus } from '@/types/manga';
import { v4 as uuidv4 } from 'uuid';
import { getBestApiForType } from '@/lib/apiUtils';

/**
 * Serviço de API para buscar dados de mangá de diversas fontes
 */

// Tipos para APIs externas
interface KitsuManga {
  id: string;
  attributes: {
    canonicalTitle: string;
    titles: Record<string, string>;
    synopsis: string;
    status: string;
    posterImage: {
      original?: string;
      large?: string;
      medium?: string;
    };
    startDate: string;
    chapterCount: number | null;
  };
  relationships: {
    genres: {
      data: Array<{ id: string }>;
    };
  };
}

interface JikanManga {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  chapters?: number;
  status?: string;
  published: {
    from?: string;
  };
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  authors: Array<{
    name: string;
  }>;
  genres: Array<{
    name: string;
  }>;
}

interface MangaDexManga {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    year: number | null;
    status: string;
    contentRating: string;
    tags: Array<{
      id: string;
      attributes: {
        name: Record<string, string>;
      };
    }>;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
    };
  }>;
}

// Função utilitária para logs detalhados e padronizados
function logDetalhado(
  nivel: 'INFO' | 'WARN' | 'ERROR',
  contexto: string,
  mensagem: string,
  dados?: any
) {
  const timestamp = new Date().toISOString();
  let logMsg = `[${timestamp}] [${nivel}] [${contexto}] ${mensagem}`;
  if (dados !== undefined) {
    try {
      logMsg += `\n${JSON.stringify(dados, null, 2)}`;
    } catch {
      logMsg += `\n${String(dados)}`;
    }
  }
  // Corrigido: usar apenas console nativo para evitar recursão infinita
  if (nivel === 'ERROR') {
    console.error(logMsg);
  } else if (nivel === 'WARN') {
    console.warn(logMsg);
  } else {
    console.log(logMsg);
  }
}


// Funções auxiliares para converter os resultados das APIs para nosso formato interno
const mapAniListToManga = (media: any): Manga => {
  return {
    id: `anilist-${media.id}`,
    title: media.title?.romaji || media.title?.english || media.title?.native || 'Sem título',
    description: media.description ? media.description.replace(/<br\s*\/?\>/g, '\n').replace(/(<([^>]+)>)/gi, '') : '',
    status: media.status === 'FINISHED' ? 'completo' : media.status === 'RELEASING' ? 'em_andamento' : 'hiato',
    type: 'manga',
    cover: media.coverImage?.large || media.coverImage?.medium || '',
    publishYear: media.startDate?.year || new Date().getFullYear(),
    totalChapters: typeof media.chapters === 'number' ? media.chapters : null,
    genres: Array.isArray(media.genres) ? media.genres : [],
    author: media.staff?.edges?.[0]?.node?.name?.full || 'Desconhecido',
    artist: '',
    publisher: '',
  };
};

const mapKitsuToManga = (data: KitsuManga): Manga => {
  const title = data.attributes.canonicalTitle || 
    data.attributes.titles.en_jp || 
    data.attributes.titles.en || 
    Object.values(data.attributes.titles)[0] || 'Sem título';
  const status = data.attributes.status === 'finished' ? 'completo' : 
                data.attributes.status === 'current' ? 'em_andamento' : 'hiato';
  const year = data.attributes.startDate ? 
    parseInt(data.attributes.startDate.split('-')[0]) : new Date().getFullYear();
  return {
    id: uuidv4(),
    title,
    description: data.attributes.synopsis || '',
    status: status as MangaStatus,
    type: 'manga',
    cover: data.attributes.posterImage?.large || data.attributes.posterImage?.medium || '',
    publishYear: year,
    totalChapters: typeof data.attributes.chapterCount === 'number' ? data.attributes.chapterCount : null,
    genres: [],
    author: 'Desconhecido',
    artist: '',
    publisher: '',
  };
};

const mapJikanToManga = (data: JikanManga): Manga => {
  const status = data.status?.toLowerCase().includes('finish') ? 'completo' : 
               data.status?.toLowerCase().includes('publish') ? 'em_andamento' : 'hiato';
  const year = data.published.from ? 
    parseInt(data.published.from.split('-')[0]) : new Date().getFullYear();
  return {
    id: `jikan-${data.mal_id}`,
    title: data.title_english || data.title,
    description: data.synopsis || '',
    status: status as MangaStatus,
    type: 'manga',
    cover: data.images.jpg.large_image_url || data.images.jpg.image_url || '',
    publishYear: year,
    totalChapters: typeof data.chapters === 'number' ? data.chapters : null,
    author: data.authors?.[0]?.name || 'Desconhecido',
    artist: '',
    publisher: '',
    genres: data.genres?.map(g => g.name) || [],
  };
};

const mapMangaDexToManga = (data: MangaDexManga): Manga => {
  const titles = data.attributes.title;
  const title = titles['pt-br'] || titles['pt'] || titles['en'] || Object.values(titles)[0] || 'Sem título';
  const descriptions = data.attributes.description;
  const description = descriptions['pt-br'] || descriptions['pt'] || descriptions['en'] || Object.values(descriptions)[0] || '';
  let status: MangaStatus = 'em_andamento';
  if (data.attributes.status) {
    if (data.attributes.status.toLowerCase().includes('completed')) status = 'completo';
    else if (data.attributes.status.toLowerCase().includes('ongoing')) status = 'em_andamento';
    else if (data.attributes.status.toLowerCase().includes('hiatus')) status = 'hiato';
  }
  const genres = data.attributes.tags
    .map(tag => tag.attributes.name['pt'] || tag.attributes.name['en'])
    .filter(Boolean);
  // Tentar extrair autor do relationships
  let author = 'Desconhecido';
  const authorRel = data.relationships?.find(r => r.type === 'author' && r.attributes?.name);
  if (authorRel && authorRel.attributes?.name) author = authorRel.attributes.name;
  return {
    id: `mangadex-${data.id}`,
    title,
    description,
    status,
    type: 'manga',
    cover: 'https://via.placeholder.com/600x800?text=Capa+Não+Disponível', // Pode ser melhorado com fetch da capa real
    publishYear: typeof data.attributes.year === 'number' ? data.attributes.year : new Date().getFullYear(),
    totalChapters: null,
    author,
    artist: '',
    publisher: '',
    genres,
  };
};

// Classes de API

class MangaAPI {
  /**
   * Busca mangás em múltiplas APIs, com fallback e tratamento de erro robusto.
   * Sempre retorna um objeto padronizado para fácil tratamento na interface.
   *
   * Sugestão de uso do utilitário getBestApiForType:
   *   const apis = getBestApiForType(tipoDoManga)
   *   for (const api of apis) { ... }
   * Isso permite customizar a ordem de fallback conforme o tipo (manga, manhwa, webtoon).
   */
  async search(query: string, limit: number = 10): Promise<{ data: Partial<Manga>[]; error?: string }> {
    if (!query.trim()) {
      return { data: [], error: 'Consulta vazia.' };
    }
    // 1. Tenta Kitsu
    try {
      logDetalhado('INFO', 'apiService', `Buscando na API Kitsu: "${query}"`);
      const response = await fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(query)}&page[limit]=${limit}`);
      if (!response.ok) {
        throw new Error(`API Kitsu respondeu com status ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('Nenhum resultado da Kitsu');
      }
      return { data: data.data.map(mapKitsuToManga) };
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro na API Kitsu:', error);
    }
    // 2. Fallback: Jikan
    try {
      logDetalhado('INFO', 'apiService', `Buscando na API Jikan: "${query}"`);
      const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`API Jikan respondeu com status ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('Nenhum resultado da Jikan');
      }
      return { data: data.data.map(mapJikanToManga) };
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro na API Jikan:', error);
    }
    // 3. Fallback: MangaDex
    try {
      logDetalhado('INFO', 'apiService', `Buscando na API MangaDex: "${query}"`);
      const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`API MangaDex respondeu com status ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('Nenhum resultado do MangaDex');
      }
      return { data: data.data.map(mapMangaDexToManga) };
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro na API MangaDex:', error);
    }
    // 4. Fallback: AniList
    try {
      logDetalhado('INFO', 'apiService', `Buscando na API AniList: "${query}"`);
      const anilistQuery = {
        query: `
          query ($search: String, $limit: Int) {
            Page(perPage: $limit) {
              media(search: $search, type: MANGA) {
                id
                title { romaji english native }
                description
                status
                coverImage { large medium }
                startDate { year }
                chapters
                genres
                staff(perPage: 1) { edges { node { name { full } } } }
              }
            }
          }
        `,
        variables: { search: query, limit }
      };
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anilistQuery)
      });
      if (!response.ok) {
        throw new Error(`API AniList respondeu com status ${response.status}`);
      }
      const data = await response.json();
      const medias = data.data?.Page?.media || [];
      if (!medias.length) {
        throw new Error('Nenhum resultado do AniList');
      }
      return { data: medias.map(mapAniListToManga) };
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro na API AniList:', error);
    }
    // 5. Fallback: MyAnimeList (MAL)
    try {
      logDetalhado('INFO', 'apiService', `Buscando na API MyAnimeList: "${query}"`);
      const response = await fetch(`https://api.myanimelist.net/v2/manga?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: { 'X-MAL-CLIENT-ID': import.meta.env.VITE_MAL_CLIENT_ID }
        }
      );
      if (!response.ok) {
        throw new Error(`API MyAnimeList respondeu com status ${response.status}`);
      }
      const data = await response.json();
      const mangas = data.data || [];
      if (!mangas.length) {
        throw new Error('Nenhum resultado do MyAnimeList');
      }
      // Conversão para o tipo Manga
      const mapMALToManga = (mal: any): Manga => {
        const node = mal.node || mal;
        return {
          id: `mal-${node.id}`,
          title: node.title,
          description: node.synopsis || '',
          status: node.status === 'finished' ? 'completo' : node.status === 'publishing' ? 'em_andamento' : 'hiato',
          type: 'manga',
          cover: node.main_picture?.large || node.main_picture?.medium || '',
          publishYear: node.start_date ? parseInt(node.start_date.split('-')[0]) : new Date().getFullYear(),
          totalChapters: typeof node.num_chapters === 'number' ? node.num_chapters : null,
          genres: node.genres?.map((g: any) => g.name) || [],
          author: '',
          artist: '',
          publisher: '',
        };
      };
      return { data: mangas.map(mapMALToManga) };
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro na API MyAnimeList:', error);
    }
    // 6. Todos os fallbacks falharam
    return {
      data: [],
      error: 'Não foi possível buscar mangás nas APIs externas. Tente novamente mais tarde.'
    };
  }

  
  async popular(limit: number = 10): Promise<Partial<Manga>[]> {
    try {
      logDetalhado('INFO', 'apiService', `Buscando mangás populares na API Jikan`);
      // Tenta usar Jikan para mangás populares
      const response = await fetch(`https://api.jikan.moe/v4/top/manga?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API Jikan respondeu com status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        return [];
      }
      
      return data.data.map(mapJikanToManga);
    } catch (error) {
      logDetalhado('ERROR', 'apiService', 'Erro ao buscar mangás populares:', error);
      return [];
    }
  }
}

export const mangaAPI = new MangaAPI();
