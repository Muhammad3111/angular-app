// store/auth/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/toast.service';
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
  updateProfile,
  updateProfileSuccess,
  updateProfileFailure,
} from './auth.actions';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserId } from './auth.selector';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(Store);
  private toast = inject(ToastService);

  private baseUrl = 'https://api.moneychange.uz';

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
          map((res) =>
            loadMeSuccess({
              id: res?.id ?? '',
              username: res?.username ?? '',
              phone: res?.phone ?? '',
              role: res?.role ?? '',
              secretKey: res?.secretKey ?? '',
            })
          ),
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
          map((res) => {
            if (!res?.access_token || !res?.refresh_token) {
              throw new Error("Token ma'lumotlari topilmadi");
            }

            return registerSuccess({
              access_token: res.access_token,
              refresh_token: res.refresh_token,
            });
          }),
          catchError((err) =>
            of(
              registerFailure({
                error: err?.error?.message || err?.message || 'Register failed',
              })
            )
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

  authFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure, registerFailure),
        tap(({ error }) => this.toast.show('error', error ?? 'Amal bajarilmadi'))
      ),
    { dispatch: false }
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfile),
      withLatestFrom(this.store.select(selectUserId)),
      mergeMap(([{ profile }, id]) => {
        if (!id) {
          return of(updateProfileFailure({ error: 'Foydalanuvchi aniqlanmadi' }));
        }

        return this.http.patch<any>(`${this.baseUrl}/api/users/${id}`, profile).pipe(
          map((res) =>
            updateProfileSuccess({
              profile: {
                id: res?.id ?? id,
                username: res?.username ?? profile.username,
                phone: res?.phone ?? profile.phone,
                role: res?.role ?? profile.role,
                secretKey: res?.secretKey ?? profile.secretKey,
              },
            })
          ),
          catchError((err) =>
            of(
              updateProfileFailure({
                error: err.error?.message || 'Profilni yangilashda xatolik yuz berdi',
              })
            )
          )
        );
      })
    )
  );

  // 🔹 SUCCESS holatida localStorage + redirect + xabar
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ access_token, refresh_token }) => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
          }

          this.toast.show('success', 'Siz tizimga muvaffaqiyatli kirdingiz');
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        tap(({ access_token, refresh_token }) => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
          }

          this.toast.show('success', "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi");
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
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('access_token', access_token);
          }
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
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
