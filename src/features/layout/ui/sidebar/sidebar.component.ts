import {Component, computed, inject, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {LayoutStore, NavItem} from '../../model/layout.store';
import {AuthStore} from '@shared/model/stores/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly layoutStore = inject(LayoutStore);

  itemClick = output<NavItem>();
  logout = output<void>();
  navigateToSettings = output<void>();
  navigateToNotifications = output<void>();

  user = computed(() => this.authStore.user());
  userInfo = computed(() => {
    const user = this.user();
    if (!user) return null;

    return {
      name: user.username,
      initials: this.getInitials(user.username),
      role: 'Super Admin',
      email: user.email,
    };
  });


  private getInitials(name: string): string {
    if (!name) return '?';
    return name
      .trim()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  isRouteActive(routerLink: string | undefined): boolean {
    if (!routerLink) return false;
    return this.router.url === routerLink || this.router.url.startsWith(routerLink + '/');
  }

  hasActiveChild(item: NavItem): boolean {
    if (!item.items) return false;
    return item.items.some((child) => this.isRouteActive(child.routerLink));
  }

  handleNavigation(item: NavItem, event?: Event): void {
    if (item.disabled) {
      event?.preventDefault();
      return;
    }

    if (item.items && item.items.length > 0) {
      event?.preventDefault();
      event?.stopPropagation();
      this.layoutStore.toggleSubmenu(item);
    } else {
      this.itemClick.emit(item);
    }
  }

  onLogout(): void {
    this.logout.emit();
  }

  onNavigateToSettings(): void {
    this.navigateToSettings.emit();
  }
}
