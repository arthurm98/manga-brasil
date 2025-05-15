/**
 * Utilitário para seleção automática da melhor API para busca de dados de mangás.
 * Retorna uma ordem de prioridade de APIs baseada no tipo do mangá.
 *
 * @param type Tipo do mangá ('manga', 'manhwa', 'webtoon')
 * @returns Array de strings com ordem de prioridade das APIs
 */
export function getBestApiForType(type: 'manga' | 'manhwa' | 'webtoon'): string[] {
  switch (type) {
    case 'manga':
      // Mangá: Kitsu > Jikan > MangaDex > AniList
      return ['Kitsu', 'Jikan', 'MangaDex', 'AniList'];
    case 'manhwa':
      // Manhwa: MangaDex > Kitsu > AniList
      return ['MangaDex', 'Kitsu', 'AniList'];
    case 'webtoon':
      // Webtoon: MangaDex > AniList
      return ['MangaDex', 'AniList'];
    default:
      return ['Kitsu', 'Jikan', 'MangaDex', 'AniList'];
  }
}

/**
 * Documentação:
 * Esta função pode ser usada para decidir a ordem de fallback ao buscar dados externos
 * sobre capítulos, status ou outras informações do mangá, conforme o tipo selecionado.
 *
 * Exemplo de uso:
 *   const apis = getBestApiForType(manga.type);
 *   for (const api of apis) { ... }
 */
