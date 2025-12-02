import {Routes} from '@angular/router';
import {LoginPage} from '@pages/authentication/ui/login/login.page';
import {authGuard, roleGuard} from '../shared';
import {AdminLayoutComponent} from '@features/layout/ui/admin-layout/admin-layout.component';
import {NotFoundPage} from '@pages/authentication/ui/not-found/not-found.page';

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
      { path: '', redirectTo: 'districts', pathMatch: 'full' },

      // ==================== PLANS ====================
      {
        path: 'plans',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/plans/ui/plans/plans.page'),
          },
          {
            path: 'create',
            loadComponent: () => import('@pages/plan-create-edit/ui/plan-form/plan-form.page'),
          },
          {
            path: 'edit/:id',
            loadComponent: ()=> import('@pages/plan-create-edit/ui/plan-form/plan-form.page'),
          },
        ],
      },

      // ==================== DISTRICTS ====================
      {
        path: 'districts',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/districts/ui/districts/districts.page').then(p => p.DistrictsPage),
          },
          {
            path: 'create',
            loadComponent: () => import('@pages/district-create/ui/district-form/district-form.page').then(p => p.DistrictFormPage),
          },
        ],
      },

      // ==================== DEVICE ====================
      {
        path: 'iot-devices',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/devices/ui/devices/devices.page').then(p => p.DevicesPage),
          },
          {
            path: 'create',
            loadComponent: () => import('@pages/devices/ui/devices-create/devices-create.page').then(p => p.DeviceCreatePage),
          },
        ],
      }
    ],
  },

  // ==================== NOT FOUND PAGE ====================
  { path: '**',
    component: NotFoundPage
  }
];
