import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as UsersActions from './users.actions';
import { environment } from '../../../environments/environment';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/users`;

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.http.get<any[]>(this.apiUrl).pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((err) =>
            of(
              UsersActions.loadUsersFailure({
                error: err?.error?.message || err?.message || 'Failed to load users',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      mergeMap(({ id }) =>
        this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
          map((user) => UsersActions.loadUserSuccess({ user })),
          catchError((err) =>
            of(
              UsersActions.loadUserFailure({
                error: err?.error?.message || err?.message || 'Failed to load user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      mergeMap(({ user }) =>
        this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
          map((response) => {
            const newUser = response.user || response;
            return UsersActions.createUserSuccess({ user: newUser });
          }),
          catchError((err) =>
            of(
              UsersActions.createUserFailure({
                error: err?.error?.message || err?.message || 'Failed to create user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ id, changes }) =>
        this.http.patch<any>(`${this.apiUrl}/${id}`, changes).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),
          catchError((err) =>
            of(
              UsersActions.updateUserFailure({
                error: err?.error?.message || err?.message || 'Failed to update user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((err) =>
            of(
              UsersActions.deleteUserFailure({
                error: err?.error?.message || err?.message || 'Failed to delete user',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
