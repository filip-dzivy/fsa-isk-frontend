import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { LoanView, LoanStatus } from '../../models/loan.model';
import { NewLoanModalComponent } from '../../shared/modals/new-loan-modal.component';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-loans',
  imports: [CommonModule, FormsModule, NewLoanModalComponent],
  templateUrl: './loans.component.html',
})
export class LoansComponent implements OnInit {
  allLoans: LoanView[] = [];
  filteredLoans: LoanView[] = [];
  isLoading = true;
  showAlert = true;
  showNewLoanModal = false;

  activeTab: LoanStatus | 'ALL' = 'ACTIVE';
  searchQuery = '';

  currentPage = 1;
  totalPages = 1;
  pageNumbers: number[] = [];

  counts = { active: 0, overdue: 0, returned: 0, all: 0 };

  get overdueCount(): number { return this.counts.overdue; }

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;
    this.loanService.getLoans().subscribe({
      next: loans => {
        this.allLoans = loans;
        this.counts = {
          active:   loans.filter(l => l.status === 'ACTIVE').length,
          overdue:  loans.filter(l => l.status === 'OVERDUE').length,
          returned: loans.filter(l => l.status === 'RETURNED').length,
          all:      loans.length,
        };
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  setTab(tab: LoanStatus | 'ALL'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.allLoans];
    if (this.activeTab !== 'ALL') {
      filtered = filtered.filter(l => l.status === this.activeTab);
    }
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        l =>
          l.memberName.toLowerCase().includes(q) ||
          l.bookTitle.toLowerCase().includes(q) ||
          l.bookIsbn.includes(q),
      );
    }
    this.totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * PAGE_SIZE;
    this.filteredLoans = filtered.slice(start, start + PAGE_SIZE);
  }

  loanStatusLabel(status: LoanStatus): string {
    const map: Record<LoanStatus, string> = {
      ACTIVE:   'Aktívna',
      OVERDUE:  'Po termíne',
      RETURNED: 'Vrátená',
    };
    return map[status] ?? status;
  }

  returnLoan(loan: LoanView): void {
    if (!confirm(`Vrátiť knihu "${loan.bookTitle}"?`)) return;
    this.loanService.returnLoan(loan.id).subscribe({
      next: () => this.loadLoans(),
      error: err => alert(`Chyba: ${err.error?.message ?? 'Nepodarilo sa vrátiť knihu'}`),
    });
  }

  renewLoan(loan: LoanView): void {
    this.loanService.renewLoan(loan.id).subscribe({
      next: () => this.loadLoans(),
      error: err => alert(`Chyba: ${err.error?.message ?? 'Nepodarilo sa predĺžiť výpožičku'}`),
    });
  }

  openLoanDetail(loan: LoanView): void {
    alert(`Výpožička #${loan.id}\nKniha: ${loan.bookTitle}\nČitateľ: ${loan.memberName}\nStav: ${loan.status}`);
  }

  openNewLoanModal(): void {
    this.showNewLoanModal = true;
  }

  onLoanCreated(): void {
    this.showNewLoanModal = false;
    this.loadLoans();
  }

  dismissAlert(): void {
    this.showAlert = false;
  }

  exportLoans(): void {
    alert('Export výpožičiek do CSV nie je ešte implementovaný.');
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.applyFilters(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.applyFilters(); }
  }

  goToPage(p: number): void {
    this.currentPage = p;
    this.applyFilters();
  }
}
