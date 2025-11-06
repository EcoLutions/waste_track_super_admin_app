import { Injectable, inject } from '@angular/core';
import { AuthStore } from '../stores';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly authStore = inject(AuthStore);

  initializeApp(): Promise<void> {
    return new Promise(async (resolve) => {
      this.authStore.initializeAuth();

      if (this.authStore.isAuthenticated()) {
        await this.authStore.refreshUser();
      }

      resolve();
    });
  }
}
