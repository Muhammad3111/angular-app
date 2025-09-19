import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// 🔹 Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// 🔹 Username
export const selectUsername = createSelector(selectAuthState, (state) => state.username);

// 🔹 Role
export const selectRole = createSelector(selectAuthState, (state) => state.role);
