export interface MALManga {
  id: number;
  title: string;
  main_picture?: {
    large: string;
    medium: string;
  };
  alternative_titles?: {
    en?: string;
    ja?: string;
    synonyms?: string[];
  };
  synopsis?: string;
  genres?: { name: string }[];
  num_chapters?: number;
  status?: string;
  my_list_status?: any;
  url?: string;
}
