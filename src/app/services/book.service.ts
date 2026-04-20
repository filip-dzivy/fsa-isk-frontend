import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, CreateBookRequest } from '../models/book.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks(filters?: { title?: string; author?: string; genre?: string }): Observable<Book[]> {
    let params = new HttpParams();
    if (filters?.title)  params = params.set('title', filters.title);
    if (filters?.author) params = params.set('author', filters.author);
    if (filters?.genre)  params = params.set('genre', filters.genre);
    return this.http.get<Book[]>(this.baseUrl, { params });
  }

  getBook(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${isbn}`);
  }

  createBook(request: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, request);
  }
}
