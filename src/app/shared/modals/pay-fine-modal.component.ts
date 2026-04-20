import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    return this.pendingFines
      .filter(f => f.selected)
      .reduce((sum, f) => sum + f.amount, 0);
  }

  ngOnInit(): void {
    this.pendingFines = this.member.fines
      .filter(f => f.status === 'PENDING')
      .map(f => ({ ...f, selected: true }));
  }

  onSubmit(): void {
    if (this.selectedTotal === 0) return;
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.pendingFines.forEach(f => {
        if (f.selected) {
          const orig = this.member.fines.find(mf => mf.id === f.id);
          if (orig) orig.status = 'PAID';
        }
      });
      this.closed.emit();
    }, 600);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
