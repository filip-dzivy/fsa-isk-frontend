import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from '../models/book.model';

const MOCK_BOOKS: Book[] = [
  {
    isbn: '978-0-13-235088-4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'TECHNOLOGY',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    totalCopies: 3,
    availableCopies: 2,
  },
  {
    isbn: '978-0-201-63361-0',
    title: 'Design Patterns',
    author: 'Gang of Four',
    genre: 'TECHNOLOGY',
    publisher: 'Addison-Wesley',
    publicationYear: 1994,
    totalCopies: 2,
    availableCopies: 0,
  },
  {
    isbn: '978-0-7432-7356-5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'FICTION',
    publisher: 'Scribner',
    publicationYear: 1925,
    totalCopies: 4,
    availableCopies: 3,
  },
  {
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'FICTION',
    publisher: 'Harper Perennial',
    publicationYear: 1960,
    totalCopies: 3,
    availableCopies: 1,
  },
  {
    isbn: '978-0-7432-4722-1',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'BIOGRAPHY',
    publisher: 'Simon & Schuster',
    publicationYear: 2011,
    totalCopies: 2,
    availableCopies: 2,
  },
  {
    isbn: '978-0-525-55360-5',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'FICTION',
    publisher: 'Viking',
    publicationYear: 2020,
    totalCopies: 3,
    availableCopies: 0,
  },
  {
    isbn: '978-0-14-028329-7',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'HISTORY',
    publisher: 'Harper Perennial',
    publicationYear: 2015,
    totalCopies: 4,
    availableCopies: 3,
  },
  {
    isbn: '978-0-593-31011-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'SELF_HELP',
    publisher: 'Avery',
    publicationYear: 2018,
    totalCopies: 5,
    availableCopies: 4,
  },
  {
    isbn: '978-1-5011-8248-7',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'BUSINESS',
    publisher: 'Harriman House',
    publicationYear: 2020,
    totalCopies: 2,
    availableCopies: 1,
  },
  {
    isbn: '978-80-551-5620-4',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'SCIENCE_FICTION',
    publisher: 'Chilton Books',
    publicationYear: 1965,
    totalCopies: 3,
    availableCopies: 2,
  },
];

@Injectable({ providedIn: 'root' })
export class BookService {
  getBooks(): Observable<Book[]> {
    return of(MOCK_BOOKS);
  }

  getBook(isbn: string): Observable<Book | undefined> {
    return of(MOCK_BOOKS.find(b => b.isbn === isbn));
  }

  getMockBooks(): Book[] {
    return MOCK_BOOKS;
  }
}
