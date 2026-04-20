import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberView, Fine, AvatarColor, CreateMemberRequest } from '../models/member.model';
import { environment } from '../../environments/environment';

// ── Raw backend response types ──────────────────────────────────────────────

interface BackendMoney {
  amount: number;
  currency: string;
}

interface BackendFine {
  id: number;
  amount: BackendMoney;
  reason: string;
  status: 'PENDING' | 'PAID' | 'WAIVED';
}

interface BackendMembership {
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}

interface BackendMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  memberRole: 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
  membership: BackendMembership;
  fines: BackendFine[];
}

// ── Mapper ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS: AvatarColor[] = ['blue', 'green', 'amber', 'purple'];

function mapMember(m: BackendMember): MemberView {
  const today = new Date();
  const expiryDate = m.membership ? new Date(m.membership.expiryDate) : null;
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - today.getTime()) / 86_400_000)
    : 0;
  const expiryWarning = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  const pendingFines = m.fines.filter(f => f.status === 'PENDING');
  const unpaidFinesTotal = pendingFines.reduce((sum, f) => sum + f.amount.amount, 0);

  const fines: Fine[] = m.fines.map(f => ({
    id: f.id,
    reason: f.reason,
    amount: f.amount.amount,
    currency: f.amount.currency,
    status: f.status,
  }));

  const membershipStatus = m.membership?.status ?? null;

  return {
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    initials: (m.firstName[0] + m.lastName[0]).toUpperCase(),
    avatarColor: AVATAR_COLORS[m.id % AVATAR_COLORS.length],
    memberRole: m.memberRole,
    membershipType: m.memberRole,
    membershipStatus: membershipStatus as MemberView['membershipStatus'],
    membershipExpiry: expiryDate,
    expiryWarning,
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    activeLoans: 0,
    unpaidFines: unpaidFinesTotal,
    canBorrow: membershipStatus === 'ACTIVE' && unpaidFinesTotal === 0,
    membershipActive: membershipStatus === 'ACTIVE',
    fines,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly baseUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getMembers(): Observable<MemberView[]> {
    return this.http.get<BackendMember[]>(this.baseUrl).pipe(map(list => list.map(mapMember)));
  }

  getMember(id: number): Observable<MemberView> {
    return this.http.get<BackendMember>(`${this.baseUrl}/${id}`).pipe(map(mapMember));
  }

  createMember(request: CreateMemberRequest): Observable<MemberView> {
    return this.http.post<BackendMember>(this.baseUrl, request).pipe(map(mapMember));
  }

  renewMembership(memberId: number): Observable<MemberView> {
    return this.http
      .post<BackendMember>(`${this.baseUrl}/${memberId}/membership/renew`, {})
      .pipe(map(mapMember));
  }

  payFine(memberId: number, fineId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${memberId}/fines/${fineId}/pay`, {});
  }

  waiveFine(memberId: number, fineId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${memberId}/fines/${fineId}/waive`, {});
  }
}
