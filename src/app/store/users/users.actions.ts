import { createAction, props } from '@ngrx/store';

export interface User {
  id: string;
  username: string;
  phone: string;
  role: 'admin' | 'operator' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  username: string;
  phone: string;
  password: string;
  role: 'admin' | 'operator' | 'user';
  secretKey: string;
}

export interface UpdateUserDto {
  username?: string;
  phone?: string;
  password?: string;
  role?: 'admin' | 'operator' | 'user';
}

// Load all users
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>(),
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>(),
);

// Load single user
export const loadUser = createAction('[Users] Load User', props<{ id: string }>());
export const loadUserSuccess = createAction('[Users] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction(
  '[Users] Load User Failure',
  props<{ error: string }>(),
);

// Create user
export const createUser = createAction('[Users] Create User', props<{ user: CreateUserDto }>());
export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>(),
);
export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>(),
);

// Update user
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: string; changes: UpdateUserDto }>(),
);
export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>(),
);
export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>(),
);

// Delete user
export const deleteUser = createAction('[Users] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: string }>(),
);
export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>(),
);
