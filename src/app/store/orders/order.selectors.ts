import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ORDERS_FEATURE_KEY, OrdersState, selectAll, selectEntities } from './order.reducer';

export const selectOrdersState = createFeatureSelector<OrdersState>(ORDERS_FEATURE_KEY);

export const selectAllOrders = createSelector(selectOrdersState, selectAll);
export const selectOrderEntities = createSelector(selectOrdersState, selectEntities);
export const selectOrdersLoading = createSelector(selectOrdersState, (s) => s.loading);
export const selectOrdersError = createSelector(selectOrdersState, (s) => s.error);
export const selectSelectedOrderId = createSelector(selectOrdersState, (s) => s.selectedId);
export const selectSelectedOrder = createSelector(
  selectOrderEntities,
  selectSelectedOrderId,
  (entities, id) => (id ? entities[id] ?? null : null)
);
