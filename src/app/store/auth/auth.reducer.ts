// store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  refreshSuccess,
  logout,
  loadMeSuccess,
} from './auth.actions';

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  error: string | null;
  id: string | null;
  username: string | null;
  phone: string | null;
  role: string | null;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
  error: null,
  id: null,
  username: null,
  phone: null,
  role: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { access_token, refresh_token }) => ({
    ...state,
    access_token,
    refresh_token,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({ ...state, error })),
  on(registerSuccess, (state) => ({ ...state, error: null })),
  on(registerFailure, (state, { error }) => ({ ...state, error })),
  on(refreshSuccess, (state, { access_token }) => ({
    ...state,
    access_token,
    error: null,
  })),
  on(loadMeSuccess, (state, { id, username, phone, role }) => ({
    ...state,
    id,
    username,
    phone,
    role,
    error: null,
  })),
  on(logout, () => initialState)
);
