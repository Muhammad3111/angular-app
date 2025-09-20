import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { loadMe } from '../../store/auth/auth.actions';
import { selectRole } from '../../store/auth/auth.selector';

const hasToken = (): boolean =>
  typeof localStorage !== 'undefined' && !!localStorage.getItem('access_token');

const resolveAccess = () => {
  const router = inject(Router);
  return hasToken() ? true : router.createUrlTree(['/login']);
};

export const authGuard: CanActivateFn = () => resolveAccess();

export const authChildGuard: CanActivateChildFn = () => resolveAccess();

const resolveRoleAccess = async (allowedRoles?: string[]) => {
  const router = inject(Router);
  const store = inject(Store);

  if (!hasToken()) {
    return router.createUrlTree(['/login']);
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  let role = await firstValueFrom(store.select(selectRole).pipe(take(1)));

  if (!role) {
    store.dispatch(loadMe());

    try {
      role = await firstValueFrom(
        store
          .select(selectRole)
          .pipe(
            filter((value): value is string => !!value),
            take(1)
          )
      );
    } catch (e) {
      return router.createUrlTree(['/dashboard']);
    }
  }

  return role && allowedRoles.includes(role)
    ? true
    : router.createUrlTree(['/dashboard']);
};

export const roleGuard: CanActivateFn = (route) => {
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  return resolveRoleAccess(allowedRoles);
};
