export type BookGenre =
  | 'FICTION' | 'SCIENCE_FICTION' | 'FANTASY' | 'MYSTERY' | 'THRILLER'
  | 'HORROR' | 'ROMANCE' | 'HISTORICAL_FICTION' | 'ADVENTURE' | 'NOVEL'
  | 'BIOGRAPHY' | 'AUTOBIOGRAPHY' | 'HISTORY' | 'SCIENCE' | 'TECHNOLOGY'
  | 'PHILOSOPHY' | 'PSYCHOLOGY' | 'SELF_HELP' | 'BUSINESS' | 'POLITICS'
  | 'TRUE_CRIME' | 'POETRY' | 'DRAMA' | 'CHILDREN' | 'YOUNG_ADULT'
  | 'REFERENCE' | 'TRAVEL' | 'COOKBOOK' | 'ART' | 'RELIGION' | 'LANGUAGE' | 'OTHER';

export interface Book {
  isbn: string;
  title: string;
  author: string;
  genre: BookGenre;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
}

export interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  genre: BookGenre;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
}
