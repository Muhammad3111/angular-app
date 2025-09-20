// store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ phone: string; password: string }>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access_token: string; refresh_token: string }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction(
  '[Auth] Register',
  props<{ username: string; phone: string; password: string; role: string; secretKey: string }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ access_token: string; refresh_token: string }>()
);
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const refresh = createAction('[Auth] Refresh', props<{ refresh_token: string }>());
export const refreshSuccess = createAction(
  '[Auth] Refresh Success',
  props<{ access_token: string }>()
);
export const refreshFailure = createAction('[Auth] Refresh Failure', props<{ error: string }>());

export const loadMe = createAction('[Auth] Load Me');
export const loadMeSuccess = createAction(
  '[Auth] Load Me Success',
  props<{ id: string; username: string; phone: string; role: string; secretKey: string }>()
);
export const loadMeFailure = createAction('[Auth] Load Me Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{
    profile: {
      username: string;
      phone: string;
      role: string;
      secretKey: string;
      password?: string;
    };
  }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ profile: { id: string; username: string; phone: string; role: string; secretKey: string } }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);
