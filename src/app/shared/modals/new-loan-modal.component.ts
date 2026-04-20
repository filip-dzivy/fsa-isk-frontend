import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { BookService } from '../../services/book.service';
import { MemberView } from '../../models/member.model';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-new-loan-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-loan-modal.component.html',
})
export class NewLoanModalComponent implements OnInit {
  @Input() prefillIsbn = '';
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;
  submitted = false;
  isSubmitting = false;

  selectedMember: (MemberView & { fullName: string; blockReason?: string }) | null = null;
  foundBook: Book | null = null;
  bookNotFound = false;

  memberSearchResults: MemberView[] = [];
  showMemberDropdown = false;

  get dueDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  }

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      memberSearch: ['', Validators.required],
      memberId: [null, Validators.required],
      isbn: [this.prefillIsbn, Validators.required],
    });
    if (this.prefillIsbn) {
      this.lookupBook();
    }
  }

  searchMember(): void {
    const q = this.form.get('memberSearch')?.value?.toLowerCase().trim();
    if (!q || q.length < 2) {
      this.memberSearchResults = [];
      this.showMemberDropdown = false;
      return;
    }
    this.memberService.getMembers().subscribe(members => {
      this.memberSearchResults = members.filter(
        m =>
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q),
      );
      this.showMemberDropdown = this.memberSearchResults.length > 0;
    });
  }

  selectMember(member: MemberView): void {
    this.form.patchValue({
      memberSearch: `${member.firstName} ${member.lastName}`,
      memberId: member.id,
    });
    this.showMemberDropdown = false;
    this.selectedMember = {
      ...member,
      fullName: `${member.firstName} ${member.lastName}`,
      blockReason: member.membershipStatus !== 'ACTIVE'
        ? 'Neplatné členstvo'
        : member.unpaidFines > 0
          ? 'Neuhradené pokuty'
          : undefined,
    };
  }

  lookupBook(): void {
    const isbn = this.form.get('isbn')?.value?.trim();
    if (!isbn) return;
    this.bookNotFound = false;
    this.foundBook = null;
    this.bookService.getBook(isbn).subscribe(book => {
      if (book) {
        this.foundBook = book;
      } else {
        this.bookNotFound = true;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this.selectedMember?.canBorrow || !this.foundBook || this.foundBook.availableCopies === 0) {
      return;
    }
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      alert(`Výpožička vytvorená!\nKniha: ${this.foundBook?.title}\nČitateľ: ${this.selectedMember?.fullName}\nTermín: ${this.dueDate.toLocaleDateString('sk-SK')}`);
      this.closed.emit();
    }, 800);
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
