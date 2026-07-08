import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const translate = inject(TranslateService);
    const authService = inject(AuthService);

    const currentLang = translate.getCurrentLang()?.toString() ?? 'en';
    const baseUrl = environment.baseUrl;

    const modifiedReq = req.clone({
        url: req.url.includes('i18n') || req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`,
        setHeaders: {
            'Accept-Language': currentLang
        }
    });

    return next(modifiedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Bypass if the request failed on a fresh login attempt or a token refresh attempt
            const isAuthRoute = req.url.includes('/api/Auth');

            if (error.status === 401 && !isAuthRoute) {
                return authService.refreshUser().pipe(
                    switchMap(() => {
                        // Retry the original failed request
                        return next(modifiedReq);
                    }),
                    catchError((refreshError) => {
                        authService.currentUser.set(null);
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};