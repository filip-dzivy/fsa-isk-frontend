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
    this.memberService.getMembers().subscribe(members => {
      this.allMembers = members;
      this.computeStats(members);
      this.applyFilters();
      this.isLoading = false;
    });
  }

  private computeStats(members: MemberView[]): void {
    this.stats = {
      total: members.length,
      active: members.filter(m => m.membershipStatus === 'ACTIVE').length,
      expiringSoon: members.filter(m => m.expiryWarning).length,
      withFines: members.filter(m => m.unpaidFines > 0).length,
    };
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilter(): void {
    this.applyFilters();
  }

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
      filtered = filtered.filter(m => m.membershipType === this.membershipFilter);
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
      ADULT: 'Dospelý',
      STUDENT: 'Študent',
      SENIOR: 'Senior',
    };
    return map[type] ?? type;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  onMemberRegistered(member?: MemberView): void {
    this.showRegisterModal = false;
    if (member) {
      this.allMembers.push(member);
      this.computeStats(this.allMembers);
      this.applyFilters();
    }
  }

  openMemberDetail(member: MemberView): void {
    alert(`Čitateľ: ${member.firstName} ${member.lastName}\nE-mail: ${member.email}\nČlenstvo: ${member.membershipStatus}`);
  }

  openPayFineModal(member: MemberView): void {
    this.selectedMember = member;
    this.showPayFineModal = true;
  }

  onFinesPaid(): void {
    if (this.selectedMember) {
      this.selectedMember.fines.forEach(f => {
        if (f.selected) f.status = 'PAID';
      });
      this.selectedMember.unpaidFines = this.selectedMember.fines
        .filter(f => f.status === 'PENDING')
        .reduce((sum, f) => sum + f.amount, 0);
      this.selectedMember.canBorrow = this.selectedMember.membershipActive && this.selectedMember.unpaidFines === 0;
      this.computeStats(this.allMembers);
    }
    this.showPayFineModal = false;
    this.selectedMember = null;
  }

  renewMembership(member: MemberView): void {
    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + 12);
    member.membershipExpiry = newExpiry;
    member.membershipStatus = 'ACTIVE';
    member.membershipActive = true;
    member.expiryWarning = false;
    member.daysUntilExpiry = 365;
    member.canBorrow = member.unpaidFines === 0;
    this.computeStats(this.allMembers);
    alert(`Členstvo obnovené pre ${member.firstName} ${member.lastName} do ${newExpiry.toLocaleDateString('sk-SK')}`);
  }
}
