import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
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

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      memberRole: ['MEMBER'],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.emailTaken = false;
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const f = this.form.value;
    this.memberService.createMember({ firstName: f.firstName, lastName: f.lastName, email: f.email, memberRole: f.memberRole }).subscribe({
      next: member => { this.isSubmitting = false; this.closed.emit(member); },
      error: err => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.emailTaken = true;
        } else {
          alert(`Chyba: ${err.error?.message ?? 'Registrácia zlyhala'}`);
        }
      },
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.close();
  }

  close(): void {
    this.closed.emit(undefined);
  }
}
