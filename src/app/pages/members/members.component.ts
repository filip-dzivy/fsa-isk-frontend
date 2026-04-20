import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { MemberView } from '../../models/member.model';
import { RegisterMemberModalComponent } from '../../shared/modals/register-member-modal.component';
import { PayFineModalComponent } from '../../shared/modals/pay-fine-modal.component';

@Component({
  selector: 'app-members',
  imports: [CommonModule, FormsModule, CurrencyPipe, RegisterMemberModalComponent, PayFineModalComponent],
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {
  allMembers: MemberView[] = [];
  members: MemberView[] = [];
  isLoading = true;

  searchQuery = '';
  membershipFilter = '';
  statusFilter = '';

  showRegisterModal = false;
  showPayFineModal = false;
  selectedMember: MemberView | null = null;

  stats = { total: 0, active: 0, expiringSoon: 0, withFines: 0 };

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.memberService.getMembers().subscribe({
      next: members => {
        this.allMembers = members;
        this.computeStats(members);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  private computeStats(members: MemberView[]): void {
    this.stats = {
      total:        members.length,
      active:       members.filter(m => m.membershipStatus === 'ACTIVE').length,
      expiringSoon: members.filter(m => m.expiryWarning).length,
      withFines:    members.filter(m => m.unpaidFines > 0).length,
    };
  }

  onSearch(): void { this.applyFilters(); }
  onFilter(): void { this.applyFilters(); }

  private applyFilters(): void {
    let filtered = [...this.allMembers];
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        m =>
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q),
      );
    }
    if (this.membershipFilter) {
      filtered = filtered.filter(m => m.memberRole === this.membershipFilter);
    }
    if (this.statusFilter === 'ACTIVE') {
      filtered = filtered.filter(m => m.membershipStatus === 'ACTIVE');
    } else if (this.statusFilter === 'EXPIRED') {
      filtered = filtered.filter(m => m.membershipStatus === 'EXPIRED');
    } else if (this.statusFilter === 'BLOCKED') {
      filtered = filtered.filter(m => !m.canBorrow);
    }
    this.members = filtered;
  }

  membershipTypeLabel(type: string): string {
    const map: Record<string, string> = {
      MEMBER:    'Čitateľ',
      LIBRARIAN: 'Knihovník',
      ADMIN:     'Administrátor',
    };
    return map[type] ?? type;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  onMemberRegistered(member?: MemberView): void {
    this.showRegisterModal = false;
    if (member) this.loadMembers();
  }

  openMemberDetail(member: MemberView): void {
    alert(`Čitateľ: ${member.firstName} ${member.lastName}\nE-mail: ${member.email}\nČlenstvo: ${member.membershipStatus}`);
  }

  openPayFineModal(member: MemberView): void {
    this.selectedMember = member;
    this.showPayFineModal = true;
  }

  onFinesPaid(): void {
    this.showPayFineModal = false;
    this.selectedMember = null;
    this.loadMembers();
  }

  renewMembership(member: MemberView): void {
    this.memberService.renewMembership(member.id).subscribe({
      next: () => this.loadMembers(),
      error: err => alert(`Chyba: ${err.error?.message ?? 'Nepodarilo sa obnoviť členstvo'}`),
    });
  }
}
