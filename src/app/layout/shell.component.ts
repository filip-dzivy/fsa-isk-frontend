import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoanService } from '../services/loan.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  activeLoansCount = 0;
  overdueLoansCount = 0;
  readyReservationsCount = 0;
  pendingFinesCount = 3;

  constructor(
    private loanService: LoanService,
    private reservationService: ReservationService,
  ) {}

  ngOnInit(): void {
    this.loanService.getLoans().subscribe(loans => {
      this.activeLoansCount = loans.filter(l => l.status === 'ACTIVE').length;
      this.overdueLoansCount = loans.filter(l => l.status === 'OVERDUE').length;
    });
    this.reservationService.getReservations().subscribe(res => {
      this.readyReservationsCount = res.filter(r => r.status === 'READY_FOR_PICKUP').length;
    });
  }
}
