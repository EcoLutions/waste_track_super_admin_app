import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from '@shared/model/stores/auth.store';
/*
 * Auth guard
 * This guard checks if the user is authenticated
 * If not, it redirects to the login page
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router
    .navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    })
    .then(() => {});

  return false;
};

/*
 * Role guard
 * This guard checks if the user is authenticated and has the required role
 * If not, it redirects to the unauthorized page
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      router.navigate(['/login']).then(() => {});
      return false;
    }

    const userRoles = authStore.userRoles();
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.some((userRole) => userRole.name === role),
    );

    if (hasRequiredRole) {
      console.log('User has required role');
      return true;
    }

    router.navigate(['/unauthorized']).then(() => {
      console.log('User does not have required role');
    });
    return false;
  };
};
