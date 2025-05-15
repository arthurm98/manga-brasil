// Utilitário para normalizar datas em UserManga
import { UserManga } from '../types/manga';

export function parseUserMangaDates(arr: Partial<UserManga>[]): UserManga[] {
  return arr.map(m => ({
    id: m.id ?? '',
    title: m.title ?? '',
    type: m.type ?? 'manga',
    cover: m.cover ?? '',
    author: m.author ?? '',
    artist: m.artist ?? '',
    status: m.status ?? 'em_andamento',
    description: m.description ?? '',
    genres: m.genres ?? [],
    totalChapters: m.totalChapters ?? null,
    publishYear: m.publishYear ?? new Date().getFullYear(),
    publisher: m.publisher ?? '',
    readingStatus: m.readingStatus ?? 'planejo_ler',
    lastReadChapter: m.lastReadChapter ?? 0,
    rating: m.rating ?? undefined,
    dateAdded: m.dateAdded ? new Date(m.dateAdded) : new Date(),
    lastUpdated: m.lastUpdated ? new Date(m.lastUpdated) : new Date(),
    notes: m.notes ?? '',
  }));
}
