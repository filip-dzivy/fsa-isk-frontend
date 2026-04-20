export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface LoanView {
  id: number;
  bookTitle: string;
  bookIsbn: string;
  memberName: string;
  memberEmail: string;
  memberInitials: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalCount: number;
  status: LoanStatus;
  daysOverdue: number;
}

export interface CreateLoanRequest {
  memberId: number;
  isbn: string;
  createdById: number;
}
