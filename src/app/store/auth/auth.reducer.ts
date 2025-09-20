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
  updateProfile,
  updateProfileSuccess,
  updateProfileFailure,
} from './auth.actions';

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  error: string | null;
  id: string | null;
  username: string | null;
  phone: string | null;
  role: string | null;
  secretKey: string | null;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
  error: null,
  id: null,
  username: null,
  phone: null,
  role: null,
  secretKey: null,
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
  on(registerSuccess, (state, { access_token, refresh_token }) => ({
    ...state,
    access_token,
    refresh_token,
    error: null,
  })),
  on(registerFailure, (state, { error }) => ({ ...state, error })),
  on(refreshSuccess, (state, { access_token }) => ({
    ...state,
    access_token,
    error: null,
  })),
  on(loadMeSuccess, (state, { id, username, phone, role, secretKey }) => ({
    ...state,
    id,
    username,
    phone,
    role,
    secretKey,
    error: null,
  })),
  on(updateProfile, (state) => ({ ...state, error: null })),
  on(updateProfileSuccess, (state, { profile }) => ({
    ...state,
    id: profile.id,
    username: profile.username,
    phone: profile.phone,
    role: profile.role,
    secretKey: profile.secretKey,
    error: null,
  })),
  on(updateProfileFailure, (state, { error }) => ({ ...state, error })),
  on(logout, () => initialState)
);
