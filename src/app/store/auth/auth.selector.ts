import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// 🔹 Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// 🔹 Username
export const selectUsername = createSelector(selectAuthState, (state) => state.username);

// 🔹 Role
export const selectRole = createSelector(selectAuthState, (state) => state.role);

// 🔹 Phone raqami
export const selectPhone = createSelector(selectAuthState, (state) => state.phone);

// 🔹 Profile ma'lumotlari
export const selectProfile = createSelector(selectAuthState, (state) => ({
  username: state.username,
  phone: state.phone,
  role: state.role,
  secretKey: state.secretKey,
}));

export const selectUserId = createSelector(selectAuthState, (state) => state.id);
