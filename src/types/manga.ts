
export type MangaType = 'manga' | 'manhwa' | 'webtoon';

export type MangaStatus = 'em_andamento' | 'completo' | 'hiato';

export type ReadingStatus = 'lendo' | 'planejo_ler' | 'completo' | 'abandonado';

export interface Manga {
  id: string;
  title: string;
  type: MangaType;
  cover: string;
  author: string;
  artist?: string;
  status: MangaStatus;
  description: string;
  genres: string[];
  totalChapters: number | null;
  publishYear: number;
  publisher?: string;
}

export interface UserManga extends Manga {
  readingStatus: ReadingStatus;
  lastReadChapter: number;
  rating?: number;
  dateAdded: Date;
  lastUpdated: Date;
  notes?: string;
}
