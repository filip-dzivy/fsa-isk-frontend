import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book, BookGenre } from '../../models/book.model';
import { NewLoanModalComponent } from '../../shared/modals/new-loan-modal.component';

const GENRE_COLORS: Record<string, string> = {
  FICTION:          '#7C6FAE',
  SCIENCE_FICTION:  '#4A7BAE',
  FANTASY:          '#6BAE7C',
  MYSTERY:          '#AE7C4A',
  THRILLER:         '#AE4A4A',
  HORROR:           '#6B4AAE',
  ROMANCE:          '#AE4A7C',
  HISTORICAL_FICTION:'#8B6B4A',
  ADVENTURE:        '#4AAE7C',
  NOVEL:            '#7C9BAE',
  BIOGRAPHY:        '#9BAE7C',
  AUTOBIOGRAPHY:    '#AE9B7C',
  HISTORY:          '#7C8B6B',
  SCIENCE:          '#4A8BAE',
  TECHNOLOGY:       '#4A6BAE',
  PHILOSOPHY:       '#9B7CAE',
  PSYCHOLOGY:       '#7CAE9B',
  SELF_HELP:        '#AE7C9B',
  BUSINESS:         '#6B7CAE',
  POLITICS:         '#AE8B6B',
  OTHER:            '#9B9894',
};

const PAGE_SIZE = 9;

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, NewLoanModalComponent],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  allBooks: Book[] = [];
  books: Book[] = [];
  isLoading = true;

  searchQuery = '';
  selectedGenre = '';
  availabilityFilter = '';
  viewMode: 'grid' | 'list' = 'grid';

  currentPage = 1;
  totalPages = 1;
  pageNumbers: number[] = [];

  showAddBookModal = false;
  showNewLoanModal = false;
  selectedBookIsbn = '';

  get totalBooks(): number { return this.allBooks.length; }
  get availableBooks(): number { return this.allBooks.filter(b => b.availableCopies > 0).length; }
  get pageFrom(): number { return (this.currentPage - 1) * PAGE_SIZE + 1; }
  get pageTo(): number { return Math.min(this.currentPage * PAGE_SIZE, this.books.length); }

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: books => {
        this.allBooks = books;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilter(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.allBooks];
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q),
      );
    }
    if (this.selectedGenre) {
      filtered = filtered.filter(b => b.genre === this.selectedGenre);
    }
    if (this.availabilityFilter === 'available') {
      filtered = filtered.filter(b => b.availableCopies > 0);
    } else if (this.availabilityFilter === 'unavailable') {
      filtered = filtered.filter(b => b.availableCopies === 0);
    }

    this.totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * PAGE_SIZE;
    this.books = filtered.slice(start, start + PAGE_SIZE);
  }

  genreColor(genre: BookGenre): string {
    return GENRE_COLORS[genre] ?? '#9B9894';
  }

  openBookDetail(book: Book): void {
    alert(`Kniha: ${book.title}\nAutor: ${book.author}\nISBN: ${book.isbn}\nDostupné: ${book.availableCopies}/${book.totalCopies}`);
  }

  editBook(book: Book): void {
    alert(`Upraviť knihu: ${book.title}`);
  }

  reserveBook(book: Book): void {
    alert(`Rezervácia: ${book.title}`);
  }

  openAddBookModal(): void {
    this.showAddBookModal = true;
  }

  openNewLoanForBook(book: Book): void {
    this.selectedBookIsbn = book.isbn;
    this.showNewLoanModal = true;
  }

  onLoanCreated(): void {
    this.showNewLoanModal = false;
    this.selectedBookIsbn = '';
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.applyFilters(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.applyFilters(); }
  }

  goToPage(p: number): void {
    this.currentPage = p;
    this.applyFilters();
  }

  readonly genres = [
    { value: 'FICTION', label: 'Beletria' },
    { value: 'SCIENCE_FICTION', label: 'Sci-Fi' },
    { value: 'FANTASY', label: 'Fantasy' },
    { value: 'MYSTERY', label: 'Detektívka' },
    { value: 'THRILLER', label: 'Thriller' },
    { value: 'HORROR', label: 'Horor' },
    { value: 'ROMANCE', label: 'Romantika' },
    { value: 'BIOGRAPHY', label: 'Biografia' },
    { value: 'HISTORY', label: 'História' },
    { value: 'SCIENCE', label: 'Veda' },
    { value: 'TECHNOLOGY', label: 'Technológia' },
    { value: 'PHILOSOPHY', label: 'Filozofia' },
    { value: 'PSYCHOLOGY', label: 'Psychológia' },
    { value: 'SELF_HELP', label: 'Osobný rozvoj' },
    { value: 'BUSINESS', label: 'Biznis' },
    { value: 'OTHER', label: 'Ostatné' },
  ];
}
