import { Routes } from '@angular/router';
import { LoginPage } from '@pages/authentication/ui/login/login.page';
import { authGuard, roleGuard } from '../shared';
import { DashboardPage } from '@pages/dashboard/ui/dashboard/dashboard.page';
import { AdminLayoutComponent } from '@features/layout/ui/admin-layout/admin-layout.component';
import { NotFoundPage } from '@pages/authentication/ui/not-found/not-found.page';
import {PlanCatalogPage} from '@pages/plancatalog/ui/plan-catalog/plan-catalog.page';
import PlanCatalogFormPage from '@pages/plancatalog/ui/plan-catalog-form/plan-catalog-form.page';

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

      // ==================== PLAN CATALOG ====================
      {
        path: 'plan-catalog',
        component: PlanCatalogPage,
      },
      {
        path: 'plan-catalog/create',
        component: PlanCatalogFormPage,
      },
      {
        path: 'plan-catalog/edit/:id',
        component: PlanCatalogFormPage,
      },
    ],
  },

  // ==================== NOT FOUND PAGE ====================
  { path: '**',
    component: NotFoundPage
  }
];
