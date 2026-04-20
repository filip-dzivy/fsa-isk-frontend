import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { authGuard } from './core/guards/auth.guard';

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
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/loans/loans.component').then(m => m.LoansComponent),
      },
      {
        path: 'reservations',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent),
      },
      {
        path: 'members',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/members/members.component').then(m => m.MembersComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'catalog' },
];
