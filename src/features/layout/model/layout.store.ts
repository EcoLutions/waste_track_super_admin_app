import { computed, effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';

export interface NavItem {
  label: string;
  routerLink?: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
  ariaLabel?: string;
  items?: NavItem[];
  separator?: boolean;
}

export interface LayoutState {
  navItems: NavItem[];
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isMobile: boolean;
  expandedItems: Set<string>;
}

const initialState: LayoutState = {
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  isMobile: false,
  expandedItems: new Set<string>(),
  navItems: [
    {
      label: 'Dashboard',
      routerLink: '/dashboard',
      icon: 'pi pi-chart-line',
      ariaLabel: 'Panel principal',
    },
    {
      label: 'Notificaciones',
      routerLink: '/notifications',
      icon: 'pi pi-bell',
      badge: 3,
      ariaLabel: '3 notificaciones nuevas',
    },
    { label: 'separator-1', separator: true, icon: '' },
    {
      label: 'Distritos',
      icon: 'pi pi-map-marker',
      ariaLabel: 'Gestión de distritos',
      items: [
        { label: 'Todos los Distritos', routerLink: '/districts', icon: 'pi pi-list', ariaLabel: 'Ver todos los distritos' },
        { label: 'Crear Distrito', routerLink: '/districts/create', icon: 'pi pi-plus-circle', ariaLabel: 'Crear nuevo distrito' },
      ],
    },
    {
      label: 'Subscripciones',
      icon: 'pi pi-credit-card',
      ariaLabel: 'Gestión de subscripciones',
      items: [
        { label: 'Todas', routerLink: '/subscriptions', icon: 'pi pi-list', ariaLabel: 'Ver todas' },
        { label: 'Renovaciones', routerLink: '/subscriptions/renewals', icon: 'pi pi-calendar', ariaLabel: 'Próximas renovaciones' },
        { label: 'Vencidas', routerLink: '/subscriptions/expired', icon: 'pi pi-exclamation-triangle', ariaLabel: 'Subscripciones vencidas' },
      ],
    },
    {
      label: 'Billing',
      icon: 'pi pi-dollar',
      ariaLabel: 'Gestión financiera',
      items: [
        { label: 'Vista General', routerLink: '/billing', icon: 'pi pi-chart-bar', ariaLabel: 'Vista general' },
        { label: 'Pagos', routerLink: '/billing/payments', icon: 'pi pi-history', ariaLabel: 'Historial de pagos' },
        { label: 'Facturas', routerLink: '/billing/invoices', icon: 'pi pi-file', ariaLabel: 'Facturas' },
        { label: 'Pagos Fallidos', routerLink: '/billing/failed-payments', icon: 'pi pi-times-circle', ariaLabel: 'Pagos fallidos' },
      ],
    },
    { label: 'separator-2', separator: true, icon: '' },
    { label: 'Planes', routerLink: '/plans', icon: 'pi pi-dollar', ariaLabel: 'Catálogo de planes' },
/*
    { label: 'Reportes', routerLink: '/reports', icon: 'pi pi-file-pdf', ariaLabel: 'Reportes de negocio' },
*/
    { label: 'separator-3', separator: true, icon: '' },
  ],
};

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState<LayoutState>(initialState),

  withComputed((state) => ({
    isExpanded: computed(
      () => (item: NavItem) => state.expandedItems().has(item.label)
    ),
  })),

  withMethods((store) => {
    return {
      toggleSidebar(): void {
        patchState(store, (state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      closeSidebar(): void {
        patchState(store, { isSidebarOpen: false });
      },
      toggleSidebarCollapse(): void {
        patchState(store, (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },
      toggleSubmenu(item: NavItem): void {
        const expanded = new Set(store.expandedItems());
        if (expanded.has(item.label)) {
          expanded.delete(item.label);
        } else {
          expanded.add(item.label);
        }
        patchState(store, { expandedItems: expanded });
      },
    };
  }),

  withHooks((store) => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && store.isSidebarOpen()) {
        store.closeSidebar();
      }
    };

    const checkScreenSize = (): void => {
      const isMobile = window.innerWidth < 1024;
      patchState(store, { isMobile });

      if (!isMobile && store.isSidebarOpen()) {
        patchState(store, { isSidebarOpen: false });
      }
    };

    return {
      onInit() {
        effect(() => {
          if (store.isSidebarOpen()) {
            document.addEventListener('keydown', handleEscape);
          } else {
            document.removeEventListener('keydown', handleEscape);
          }
        });

        window.addEventListener('resize', checkScreenSize);

        checkScreenSize();
      },
      onDestroy() {
        document.removeEventListener('keydown', handleEscape); // Por si acaso
        window.removeEventListener('resize', checkScreenSize);
      },
    }
  })
);
