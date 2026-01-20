import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as UsersActions from './users.actions';
import { User } from './users.actions';

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user.id,
});

export const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
  selectedUserId: null,
});

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loading: false }),
  ),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.loadUser, (state, { id }) => ({
    ...state,
    loading: true,
    error: null,
    selectedUserId: id,
  })),
  on(UsersActions.loadUserSuccess, (state, { user }) =>
    usersAdapter.upsertOne(user, { ...state, loading: false }),
  ),
  on(UsersActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.createUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.createUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, { ...state, loading: false }),
  ),
  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.updateOne({ id: user.id, changes: user }, { ...state, loading: false }),
  ),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.deleteUserSuccess, (state, { id }) =>
    usersAdapter.removeOne(id, { ...state, loading: false }),
  ),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
