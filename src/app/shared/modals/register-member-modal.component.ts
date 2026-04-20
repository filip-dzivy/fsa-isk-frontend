import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberView } from '../../models/member.model';

@Component({
  selector: 'app-register-member-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-member-modal.component.html',
})
export class RegisterMemberModalComponent {
  @Output() closed = new EventEmitter<MemberView | undefined>();

  form: FormGroup;
  submitted = false;
  isSubmitting = false;
  emailTaken = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      membershipType: ['ADULT'],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.emailTaken = false;
    if (this.form.invalid) return;
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      const f = this.form.value;
      const member: MemberView = {
        id: Date.now(),
        firstName: f.firstName,
        lastName: f.lastName,
        email: f.email,
        initials: (f.firstName[0] + f.lastName[0]).toUpperCase(),
        avatarColor: 'blue',
        memberRole: 'MEMBER',
        membershipType: f.membershipType,
        membershipStatus: 'ACTIVE',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        expiryWarning: false,
        daysUntilExpiry: 365,
        activeLoans: 0,
        unpaidFines: 0,
        canBorrow: true,
        membershipActive: true,
        fines: [],
      };
      this.closed.emit(member);
    }, 600);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit(undefined);
  }
}
