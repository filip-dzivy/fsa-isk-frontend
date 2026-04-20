import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReservationView } from '../models/reservation.model';

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const MOCK_RESERVATIONS: ReservationView[] = [
  {
    id: 1,
    bookTitle: 'Design Patterns',
    bookIsbn: '978-0-201-63361-0',
    memberName: 'Eva Šimková',
    createdDate: addDays(today, -7),
    status: 'PENDING',
    positionInQueue: 1,
  },
  {
    id: 2,
    bookTitle: 'The Midnight Library',
    bookIsbn: '978-0-525-55360-5',
    memberName: 'Tomáš Blaho',
    createdDate: addDays(today, -3),
    status: 'PENDING',
    positionInQueue: 2,
  },
  {
    id: 3,
    bookTitle: 'Design Patterns',
    bookIsbn: '978-0-201-63361-0',
    memberName: 'Zuzana Ferková',
    createdDate: addDays(today, -12),
    expiryDate: addDays(today, 2),
    status: 'READY_FOR_PICKUP',
    positionInQueue: 0,
  },
  {
    id: 4,
    bookTitle: 'Clean Code',
    bookIsbn: '978-0-13-235088-4',
    memberName: 'Peter Horváth',
    createdDate: addDays(today, -20),
    status: 'CANCELLED',
    positionInQueue: 0,
  },
  {
    id: 5,
    bookTitle: 'Sapiens',
    bookIsbn: '978-0-14-028329-7',
    memberName: 'Mária Kováčová',
    createdDate: addDays(today, -45),
    status: 'EXPIRED',
    positionInQueue: 0,
  },
];

@Injectable({ providedIn: 'root' })
export class ReservationService {
  getReservations(): Observable<ReservationView[]> {
    return of(MOCK_RESERVATIONS);
  }

  getMockReservations(): ReservationView[] {
    return MOCK_RESERVATIONS;
  }
}
