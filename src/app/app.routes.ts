import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'catalog',
        loadComponent: () =>
          import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./pages/loans/loans.component').then(m => m.LoansComponent),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./pages/members/members.component').then(m => m.MembersComponent),
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'catalog' },
];
