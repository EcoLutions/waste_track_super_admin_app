import { Routes } from '@angular/router';
import { LoginPage } from '../pages/authentication/ui/login/login.page';
import { authGuard, roleGuard } from '../shared';
import { DashboardPage } from '../pages/dashboard/ui/dashboard/dashboard.page';
import { AdminLayoutComponent } from '../features/layout/ui/admin-layout/admin-layout.component';
import {NotFoundPage} from '../pages/authentication/ui/not-found/not-found.page';

export const routes: Routes = [
  // ==================== PUBLIC PAGES ====================
  {
    path: 'login',
    component: LoginPage,
  },

  // ==================== MAIN PAGES =========================
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ROLE_SYSTEM_ADMINISTRATOR'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // ==================== MAIN DASHBOARD ====================
      {
        path: 'dashboard',
        component: DashboardPage,
      },
    ],
  },

  // ==================== NOT FOUND PAGE ====================
  { path: '**',
    component: NotFoundPage
  }
];
