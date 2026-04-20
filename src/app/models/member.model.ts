export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
export type MemberRole = 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
export type AvatarColor = 'blue' | 'green' | 'amber' | 'purple';

export interface Fine {
  id: number;
  reason: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'WAIVED';
  selected?: boolean;
}

export interface MemberView {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  avatarColor: AvatarColor;
  memberRole: MemberRole;
  membershipType: string;
  membershipStatus: MembershipStatus;
  membershipExpiry: Date;
  expiryWarning: boolean;
  daysUntilExpiry: number;
  activeLoans: number;
  unpaidFines: number;
  canBorrow: boolean;
  membershipActive: boolean;
  fines: Fine[];
}

export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  memberRole: MemberRole;
}
