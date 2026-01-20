import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState, usersAdapter } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

const { selectAll, selectEntities, selectIds, selectTotal } = usersAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUsersState, selectAll);

export const selectUsersEntities = createSelector(selectUsersState, selectEntities);

export const selectUsersIds = createSelector(selectUsersState, selectIds);

export const selectUsersTotal = createSelector(selectUsersState, selectTotal);

export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);

export const selectUsersError = createSelector(selectUsersState, (state) => state.error);

export const selectSelectedUserId = createSelector(
  selectUsersState,
  (state) => state.selectedUserId,
);

export const selectSelectedUser = createSelector(
  selectUsersEntities,
  selectSelectedUserId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null),
);
