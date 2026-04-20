import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MemberView, Fine } from '../models/member.model';

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const MOCK_MEMBERS: MemberView[] = [
  {
    id: 1,
    firstName: 'Ján',
    lastName: 'Novák',
    email: 'jan.novak@email.sk',
    initials: 'JN',
    avatarColor: 'blue',
    memberRole: 'MEMBER',
    membershipType: 'ADULT',
    membershipStatus: 'ACTIVE',
    membershipExpiry: addDays(today, 245),
    expiryWarning: false,
    daysUntilExpiry: 245,
    activeLoans: 2,
    unpaidFines: 0,
    canBorrow: true,
    membershipActive: true,
    fines: [],
  },
  {
    id: 2,
    firstName: 'Mária',
    lastName: 'Kováčová',
    email: 'maria.kovacova@email.sk',
    initials: 'MK',
    avatarColor: 'green',
    memberRole: 'MEMBER',
    membershipType: 'STUDENT',
    membershipStatus: 'ACTIVE',
    membershipExpiry: addDays(today, 18),
    expiryWarning: true,
    daysUntilExpiry: 18,
    activeLoans: 1,
    unpaidFines: 0,
    canBorrow: true,
    membershipActive: true,
    fines: [],
  },
  {
    id: 3,
    firstName: 'Peter',
    lastName: 'Horváth',
    email: 'peter.horvath@email.sk',
    initials: 'PH',
    avatarColor: 'amber',
    memberRole: 'MEMBER',
    membershipType: 'ADULT',
    membershipStatus: 'ACTIVE',
    membershipExpiry: addDays(today, 89),
    expiryWarning: false,
    daysUntilExpiry: 89,
    activeLoans: 0,
    unpaidFines: 2.50,
    canBorrow: false,
    membershipActive: true,
    fines: [
      { id: 1, reason: 'Oneskorené vrátenie – Clean Code', amount: 2.50, currency: 'EUR', status: 'PENDING' },
    ],
  },
  {
    id: 4,
    firstName: 'Eva',
    lastName: 'Šimková',
    email: 'eva.simkova@email.sk',
    initials: 'EŠ',
    avatarColor: 'purple',
    memberRole: 'MEMBER',
    membershipType: 'SENIOR',
    membershipStatus: 'EXPIRED',
    membershipExpiry: addDays(today, -15),
    expiryWarning: false,
    daysUntilExpiry: 0,
    activeLoans: 0,
    unpaidFines: 0,
    canBorrow: false,
    membershipActive: false,
    fines: [],
  },
  {
    id: 5,
    firstName: 'Tomáš',
    lastName: 'Blaho',
    email: 'tomas.blaho@email.sk',
    initials: 'TB',
    avatarColor: 'blue',
    memberRole: 'LIBRARIAN',
    membershipType: 'ADULT',
    membershipStatus: 'ACTIVE',
    membershipExpiry: addDays(today, 310),
    expiryWarning: false,
    daysUntilExpiry: 310,
    activeLoans: 1,
    unpaidFines: 0,
    canBorrow: true,
    membershipActive: true,
    fines: [],
  },
  {
    id: 6,
    firstName: 'Zuzana',
    lastName: 'Ferková',
    email: 'zuzana.ferkova@email.sk',
    initials: 'ZF',
    avatarColor: 'green',
    memberRole: 'MEMBER',
    membershipType: 'STUDENT',
    membershipStatus: 'ACTIVE',
    membershipExpiry: addDays(today, 22),
    expiryWarning: true,
    daysUntilExpiry: 22,
    activeLoans: 1,
    unpaidFines: 5.50,
    canBorrow: false,
    membershipActive: true,
    fines: [
      { id: 2, reason: 'Oneskorené vrátenie – Dune', amount: 3.00, currency: 'EUR', status: 'PENDING' },
      { id: 3, reason: 'Oneskorené vrátenie – Sapiens', amount: 2.50, currency: 'EUR', status: 'PENDING' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class MemberService {
  getMembers(): Observable<MemberView[]> {
    return of(MOCK_MEMBERS);
  }

  getMember(id: number): Observable<MemberView | undefined> {
    return of(MOCK_MEMBERS.find(m => m.id === id));
  }

  getMockMembers(): MemberView[] {
    return MOCK_MEMBERS;
  }

  getPendingFines(memberId: number): Fine[] {
    const member = MOCK_MEMBERS.find(m => m.id === memberId);
    return member ? member.fines.filter(f => f.status === 'PENDING') : [];
  }
}
