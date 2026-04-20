import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { LoanService } from '../../services/loan.service';
import { ReservationView, ReservationStatus } from '../../models/reservation.model';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  allReservations: ReservationView[] = [];
  reservations: ReservationView[] = [];
  isLoading = true;

  activeTab: ReservationStatus | 'ALL' = 'PENDING';
  counts = { pending: 0, ready: 0, cancelled: 0, expired: 0 };

  constructor(
    private reservationService: ReservationService,
    private loanService: LoanService,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getReservations().subscribe({
      next: res => {
        this.allReservations = res;
        this.computeCounts(res);
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  private computeCounts(res: ReservationView[]): void {
    this.counts = {
      pending:   res.filter(r => r.status === 'PENDING').length,
      ready:     res.filter(r => r.status === 'READY_FOR_PICKUP').length,
      cancelled: res.filter(r => r.status === 'CANCELLED').length,
      expired:   res.filter(r => r.status === 'EXPIRED').length,
    };
  }

  setTab(tab: ReservationStatus | 'ALL'): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.reservations =
      this.activeTab === 'ALL'
        ? [...this.allReservations]
        : this.allReservations.filter(r => r.status === this.activeTab);
  }

  reservationStatusLabel(status: ReservationStatus): string {
    const map: Record<ReservationStatus, string> = {
      PENDING:          'Čakajúca',
      READY_FOR_PICKUP: 'Pripravená',
      FULFILLED:        'Vybavená',
      CANCELLED:        'Zrušená',
      EXPIRED:          'Expirovaná',
    };
    return map[status] ?? status;
  }

  /**
   * Fulfilling a reservation creates a new loan for that member + book.
   * The backend automatically marks the reservation as FULFILLED when a loan
   * is created for a member who had a READY_FOR_PICKUP reservation on that book.
   * createdById = current logged-in librarian; replace with real user ID from auth service.
   */
  fulfillReservation(r: ReservationView): void {
    if (!confirm(`Potvrdiť vyzdvihnutie pre "${r.bookTitle}" (${r.memberName})?`)) return;
    this.loanService
      .createLoan({ memberId: r.memberId, isbn: r.bookIsbn, createdById: 0 })
      .subscribe({
        next: () => this.loadReservations(),
        error: err =>
          alert(`Chyba: ${err.error?.message ?? 'Nepodarilo sa vytvoriť výpožičku'}`),
      });
  }

  cancelReservation(r: ReservationView): void {
    if (!confirm(`Zrušiť rezerváciu "${r.bookTitle}" pre ${r.memberName}?`)) return;
    this.reservationService.cancelReservation(r.id).subscribe({
      next: () => this.loadReservations(),
      error: err =>
        alert(`Chyba: ${err.error?.message ?? 'Nepodarilo sa zrušiť rezerváciu'}`),
    });
  }
}
