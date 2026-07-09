import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products-page.component').then((m) => m.ProductsPageComponent)
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alerts-page.component').then((m) => m.AlertsPageComponent)
  },
  {
    path: 'movements',
    loadComponent: () =>
      import('./features/movements/movements-page.component').then((m) => m.MovementsPageComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
