export interface AniListManga {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
  };
  description: string;
  genres: string[];
  averageScore: number;
  chapters: number;
  status: string;
  siteUrl: string;
}
