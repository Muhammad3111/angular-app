// store/auth/auth.interceptor.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const getToken = (): string | null =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;

const clearTokens = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        clearTokens();
        if (typeof window !== 'undefined') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
