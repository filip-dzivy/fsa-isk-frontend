export type ReservationStatus = 'PENDING' | 'READY_FOR_PICKUP' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';

export interface ReservationView {
  id: number;
  bookTitle: string;
  bookIsbn: string;
  memberName: string;
  createdDate: Date;
  expiryDate?: Date;
  status: ReservationStatus;
  positionInQueue: number;
}

export interface CreateReservationRequest {
  memberId: number;
  isbn: string;
}
