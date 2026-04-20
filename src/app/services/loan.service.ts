import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoanView, CreateLoanRequest } from '../models/loan.model';
import { environment } from '../../environments/environment';

// ── Raw backend response types ──────────────────────────────────────────────

interface BackendBook {
  isbn: string;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
}

interface BackendMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface BackendLoan {
  id: number;
  loanedTo: BackendMember;
  book: BackendBook;
  createdBy: BackendMember;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  renewalCount: number;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

// ── Mapper ───────────────────────────────────────────────────────────────────

function mapLoan(l: BackendLoan): LoanView {
  const today = new Date();
  const dueDate = new Date(l.dueDate);
  const daysOverdue =
    l.status === 'OVERDUE'
      ? Math.ceil((today.getTime() - dueDate.getTime()) / 86_400_000)
      : 0;

  return {
    id: l.id,
    bookTitle: l.book.title,
    bookIsbn: l.book.isbn,
    memberName: `${l.loanedTo.firstName} ${l.loanedTo.lastName}`,
    memberEmail: l.loanedTo.email,
    memberInitials: (l.loanedTo.firstName[0] + l.loanedTo.lastName[0]).toUpperCase(),
    loanDate: new Date(l.loanDate),
    dueDate,
    returnDate: l.returnDate ? new Date(l.returnDate) : undefined,
    renewalCount: l.renewalCount,
    status: l.status,
    daysOverdue,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly baseUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getLoans(): Observable<LoanView[]> {
    return this.http.get<BackendLoan[]>(this.baseUrl).pipe(map(list => list.map(mapLoan)));
  }

  getOverdueLoans(): Observable<LoanView[]> {
    return this.http.get<BackendLoan[]>(`${this.baseUrl}/overdue`).pipe(map(list => list.map(mapLoan)));
  }

  createLoan(request: CreateLoanRequest): Observable<LoanView> {
    return this.http.post<BackendLoan>(this.baseUrl, request).pipe(map(mapLoan));
  }

  returnLoan(id: number): Observable<LoanView> {
    return this.http.post<BackendLoan>(`${this.baseUrl}/${id}/return`, {}).pipe(map(mapLoan));
  }

  renewLoan(id: number): Observable<LoanView> {
    return this.http.post<BackendLoan>(`${this.baseUrl}/${id}/renew`, {}).pipe(map(mapLoan));
  }
}
