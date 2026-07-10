import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);



    if (auth.currentUser()) {
        return true;
    }

    return auth.refreshUser().pipe(
        switchMap(() =>
            of(auth.currentUser() ? true : router.createUrlTree(['/login']))
        ),
        catchError(() => of(router.createUrlTree(['/login'])))
    );
};