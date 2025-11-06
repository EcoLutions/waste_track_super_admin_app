import { Component, inject } from '@angular/core'; // <-- No se necesita OnInit
import { CommonModule, NgClass } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthStore } from '@shared/stores';
import {LayoutStore, NavItem} from '../../model/layout.store';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, NgClass, RouterOutlet, SidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent { // <-- No implementa OnInit
  private router = inject(Router);
  private authStore = inject(AuthStore);
  readonly layoutStore = inject(LayoutStore);


  handleNavigation(_: NavItem): void {
    if (this.layoutStore.isMobile()) {
      this.layoutStore.closeSidebar();
    }
  }

  handleLogout(): void {
    this.authStore.signOut();
    this.layoutStore.closeSidebar();
  }

  handleNavigateToSettings(): void {
    this.router.navigate(['/settings']).then();
    if (this.layoutStore.isMobile()) {
      this.layoutStore.closeSidebar();
    }
  }

  handleNavigateToNotifications(): void {
    this.router.navigate(['/notifications']).then();
    if (this.layoutStore.isMobile()) {
      this.layoutStore.closeSidebar();
    }
  }
}
