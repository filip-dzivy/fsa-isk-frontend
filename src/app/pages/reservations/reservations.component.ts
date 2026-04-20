import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
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

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getReservations().subscribe(res => {
      this.allReservations = res;
      this.computeCounts(res);
      this.applyFilter();
      this.isLoading = false;
    });
  }

  private computeCounts(res: ReservationView[]): void {
    this.counts = {
      pending: res.filter(r => r.status === 'PENDING').length,
      ready: res.filter(r => r.status === 'READY_FOR_PICKUP').length,
      cancelled: res.filter(r => r.status === 'CANCELLED').length,
      expired: res.filter(r => r.status === 'EXPIRED').length,
    };
  }

  setTab(tab: ReservationStatus | 'ALL'): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeTab === 'ALL') {
      this.reservations = [...this.allReservations];
    } else {
      this.reservations = this.allReservations.filter(r => r.status === this.activeTab);
    }
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

  fulfillReservation(r: ReservationView): void {
    if (!confirm(`Potvrdiť vyzdvihnutie pre "${r.bookTitle}" (${r.memberName})?`)) return;
    r.status = 'FULFILLED';
    this.computeCounts(this.allReservations);
    this.applyFilter();
  }

  cancelReservation(r: ReservationView): void {
    if (!confirm(`Zrušiť rezerváciu "${r.bookTitle}" pre ${r.memberName}?`)) return;
    r.status = 'CANCELLED';
    this.computeCounts(this.allReservations);
    this.applyFilter();
  }
}
