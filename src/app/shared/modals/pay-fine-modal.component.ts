import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { MemberService } from '../../services/member.service';
import { MemberView, Fine } from '../../models/member.model';

@Component({
  selector: 'app-pay-fine-modal',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './pay-fine-modal.component.html',
})
export class PayFineModalComponent implements OnInit {
  @Input() member!: MemberView;
  @Output() closed = new EventEmitter<void>();

  pendingFines: (Fine & { selected: boolean })[] = [];
  isSubmitting = false;

  get selectedTotal(): number {
    return this.pendingFines.filter(f => f.selected).reduce((sum, f) => sum + f.amount, 0);
  }

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.pendingFines = this.member.fines
      .filter(f => f.status === 'PENDING')
      .map(f => ({ ...f, selected: true }));
  }

  onSubmit(): void {
    const selected = this.pendingFines.filter(f => f.selected);
    if (selected.length === 0) return;
    this.isSubmitting = true;

    // Pay all selected fines in parallel
    const calls = selected.map(f => this.memberService.payFine(this.member.id, f.id));
    forkJoin(calls.length > 0 ? calls : [of(null)]).subscribe({
      next: () => { this.isSubmitting = false; this.closed.emit(); },
      error: err => {
        this.isSubmitting = false;
        alert(`Chyba: ${err.error?.message ?? 'Platba zlyhala'}`);
      },
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
