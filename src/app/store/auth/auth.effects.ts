// store/auth/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  login,
  loginSuccess,
  loginFailure,
  register,
  registerSuccess,
  registerFailure,
  refresh,
  refreshSuccess,
  refreshFailure,
  logout,
  loadMe,
  loadMeSuccess,
  loadMeFailure,
} from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = 'http://localhost:3000';

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ phone, password }) =>
        this.http.post<any>(`${this.baseUrl}/auth/login`, { phone, password }).pipe(
          map((res) =>
            loginSuccess({
              access_token: res.access_token,
              refresh_token: res.refresh_token,
            })
          ),
          catchError((err) => of(loginFailure({ error: err.error?.message || 'Login failed' })))
        )
      )
    )
  );

  me$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMe),
      mergeMap(() =>
        this.http.get<any>(`${this.baseUrl}/auth/me`).pipe(
          map((res) => loadMeSuccess(res)),
          catchError((err) =>
            of(loadMeFailure({ error: err.error?.message || 'Failed to load profile' }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap((dto) =>
        this.http.post<any>(`${this.baseUrl}/api/users/register`, dto).pipe(
          map(() => registerSuccess()),
          catchError((err) =>
            of(registerFailure({ error: err.error?.message || 'Register failed' }))
          )
        )
      )
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      mergeMap(({ refresh_token }) =>
        this.http.post<any>(`${this.baseUrl}/auth/refresh`, { refresh_token }).pipe(
          map((res) => refreshSuccess(res)),
          catchError((err) => of(refreshFailure({ error: err.error?.message || 'Refresh failed' })))
        )
      )
    )
  );

  // 🔹 SUCCESS holatida localStorage + redirect + xabar
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ access_token, refresh_token }) => {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          alert('Xush kelibsiz!'); // yoki Toastr ishlatish mumkin
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        tap(() => {
          alert('Xush kelibsiz!'); // yoki Toastr
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  // 🔹 Refresh bo‘lsa access_token yangilab qo‘yamiz
  refreshSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(refreshSuccess),
        tap(({ access_token }) => {
          localStorage.setItem('access_token', access_token);
        })
      ),
    { dispatch: false }
  );

  // 🔹 Logout → localStorage tozalash
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
