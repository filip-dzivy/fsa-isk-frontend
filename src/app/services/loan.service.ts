import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoanView } from '../models/loan.model';

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const MOCK_LOANS: LoanView[] = [
  {
    id: 1,
    bookTitle: 'Clean Code',
    bookIsbn: '978-0-13-235088-4',
    memberName: 'Ján Novák',
    memberEmail: 'jan.novak@email.sk',
    memberInitials: 'JN',
    loanDate: addDays(today, -5),
    dueDate: addDays(today, 9),
    renewalCount: 0,
    status: 'ACTIVE',
    daysOverdue: 0,
  },
  {
    id: 2,
    bookTitle: 'Sapiens',
    bookIsbn: '978-0-14-028329-7',
    memberName: 'Ján Novák',
    memberEmail: 'jan.novak@email.sk',
    memberInitials: 'JN',
    loanDate: addDays(today, -10),
    dueDate: addDays(today, 4),
    renewalCount: 1,
    status: 'ACTIVE',
    daysOverdue: 0,
  },
  {
    id: 3,
    bookTitle: 'Design Patterns',
    bookIsbn: '978-0-201-63361-0',
    memberName: 'Peter Horváth',
    memberEmail: 'peter.horvath@email.sk',
    memberInitials: 'PH',
    loanDate: addDays(today, -19),
    dueDate: addDays(today, -5),
    renewalCount: 0,
    status: 'OVERDUE',
    daysOverdue: 5,
  },
  {
    id: 4,
    bookTitle: 'The Midnight Library',
    bookIsbn: '978-0-525-55360-5',
    memberName: 'Mária Kováčová',
    memberEmail: 'maria.kovacova@email.sk',
    memberInitials: 'MK',
    loanDate: addDays(today, -3),
    dueDate: addDays(today, 11),
    renewalCount: 0,
    status: 'ACTIVE',
    daysOverdue: 0,
  },
  {
    id: 5,
    bookTitle: 'The Great Gatsby',
    bookIsbn: '978-0-7432-7356-5',
    memberName: 'Tomáš Blaho',
    memberEmail: 'tomas.blaho@email.sk',
    memberInitials: 'TB',
    loanDate: addDays(today, -30),
    dueDate: addDays(today, -16),
    returnDate: addDays(today, -20),
    renewalCount: 0,
    status: 'RETURNED',
    daysOverdue: 0,
  },
  {
    id: 6,
    bookTitle: 'Atomic Habits',
    bookIsbn: '978-0-593-31011-3',
    memberName: 'Zuzana Ferková',
    memberEmail: 'zuzana.ferkova@email.sk',
    memberInitials: 'ZF',
    loanDate: addDays(today, -8),
    dueDate: addDays(today, 6),
    renewalCount: 0,
    status: 'ACTIVE',
    daysOverdue: 0,
  },
  {
    id: 7,
    bookTitle: 'Dune',
    bookIsbn: '978-80-551-5620-4',
    memberName: 'Zuzana Ferková',
    memberEmail: 'zuzana.ferkova@email.sk',
    memberInitials: 'ZF',
    loanDate: addDays(today, -25),
    dueDate: addDays(today, -11),
    renewalCount: 1,
    status: 'OVERDUE',
    daysOverdue: 11,
  },
];

@Injectable({ providedIn: 'root' })
export class LoanService {
  getLoans(): Observable<LoanView[]> {
    return of(MOCK_LOANS);
  }

  getOverdueLoans(): Observable<LoanView[]> {
    return of(MOCK_LOANS.filter(l => l.status === 'OVERDUE'));
  }

  getMockLoans(): LoanView[] {
    return MOCK_LOANS;
  }
}
