import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationView, CreateReservationRequest } from '../models/reservation.model';
import { environment } from '../../environments/environment';

// ── Raw backend response types ──────────────────────────────────────────────

interface BackendBook {
  isbn: string;
  title: string;
  author: string;
}

interface BackendMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface BackendReservation {
  id: number;
  createdBy: BackendMember;
  book: BackendBook;
  createdOn: string;
  status: 'PENDING' | 'READY_FOR_PICKUP' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  positionInQueue: number;
}

// ── Mapper ───────────────────────────────────────────────────────────────────

function mapReservation(r: BackendReservation): ReservationView {
  const createdDate = new Date(r.createdOn);
  // READY_FOR_PICKUP has a 3-day pickup window — approximate expiry
  const expiryDate =
    r.status === 'READY_FOR_PICKUP'
      ? new Date(createdDate.getTime() + 3 * 86_400_000)
      : undefined;

  return {
    id: r.id,
    memberId: r.createdBy.id,
    bookTitle: r.book.title,
    bookIsbn: r.book.isbn,
    memberName: `${r.createdBy.firstName} ${r.createdBy.lastName}`,
    createdDate,
    expiryDate,
    status: r.status,
    positionInQueue: r.positionInQueue,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly baseUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  getReservations(): Observable<ReservationView[]> {
    return this.http
      .get<BackendReservation[]>(this.baseUrl)
      .pipe(map(list => list.map(mapReservation)));
  }

  createReservation(request: CreateReservationRequest): Observable<ReservationView> {
    return this.http
      .post<BackendReservation>(this.baseUrl, request)
      .pipe(map(mapReservation));
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
