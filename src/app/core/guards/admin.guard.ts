import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Roles } from '../enums/roles.enum';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const checkRole = () => {
    const user = auth.currentUser();

    if (user?.role.id === Roles.Admin) {
      return true;
    }

    return router.createUrlTree(['/login']);
  };

  if (auth.currentUser()) {
    return checkRole();
  }

  return auth.refreshUser().pipe(
    switchMap(() => of(checkRole())),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
