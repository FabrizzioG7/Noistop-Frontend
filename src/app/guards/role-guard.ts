import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth';

export function roleGuard(rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const snack = inject(MatSnackBar);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.tieneRol(...rolesPermitidos)) {
      return true;
    }

    snack.open('No tienes permiso para acceder a esta sección.', 'OK', { duration: 3500 });
    router.navigate(['/home']);
    return false;
  };
}
