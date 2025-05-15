// Serviço de persistência da coleção de mangás usando LocalStorage
// Estruturado para facilitar troca futura por backend/cloud

import { Manga } from "../types/manga";
import { parseUserMangaDates } from "../lib/dateUtils";

const STORAGE_KEY = "manga_collection";

export const libraryService = {
  getAll(): Manga[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const arr = JSON.parse(data);
      // Converte datas para instância Date
      if (Array.isArray(arr)) {
        return parseUserMangaDates(arr);
      }
      return [];
    } catch {
      return [];
    }
  },

  saveAll(mangas: Manga[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mangas));
  },

  add(manga: Manga): void {
    const mangas = this.getAll();
    if (!mangas.some(m => m.id === manga.id)) {
      mangas.push(manga);
      this.saveAll(mangas);
    }
  },

  remove(id: string): void {
    const mangas = this.getAll().filter(m => m.id !== id);
    this.saveAll(mangas);
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  exportToJson(): string {
    const mangas = this.getAll();
    return JSON.stringify(mangas, null, 2);
  },

  importFromJson(json: string): boolean {
    try {
      const mangas = JSON.parse(json);
      if (Array.isArray(mangas)) {
        this.saveAll(mangas);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
