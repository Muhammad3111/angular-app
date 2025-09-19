import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as OrdersActions from './order.actions';

export const ORDERS_FEATURE_KEY = 'orders';

export interface OrdersState extends EntityState<OrderEntity> {
  loading: boolean;
  error: string | null;
  selectedId: string | null;
}

export const adapter = createEntityAdapter<OrderEntity>({
  selectId: (o) => o.id,
  sortComparer: (a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''),
});

const initialState: OrdersState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedId: null,
});

export const ordersReducer = createReducer(
  initialState,

  // Load list
  on(OrdersActions.loadOrders, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.loadOrdersSuccess, (state, { response }) =>
    adapter.setAll(response.data, { ...state, loading: false })
  ),
  on(OrdersActions.loadOrdersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Load one
  on(OrdersActions.loadOrder, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.loadOrderSuccess, (state, { order }) =>
    adapter.upsertOne(order, { ...state, loading: false })
  ),
  on(OrdersActions.loadOrderFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create
  on(OrdersActions.createOrder, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.createOrderSuccess, (state, { order }) =>
    adapter.addOne(order, { ...state, loading: false })
  ),
  on(OrdersActions.createOrderFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update
  on(OrdersActions.updateOrder, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.updateOrderSuccess, (state, { order }) =>
    adapter.upsertOne(order, { ...state, loading: false })
  ),
  on(OrdersActions.updateOrderFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Delete
  on(OrdersActions.deleteOrder, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.deleteOrderSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false })
  ),
  on(OrdersActions.deleteOrderFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Select
  on(OrdersActions.selectOrder, (state, { id }) => ({ ...state, selectedId: id }))
);

// Helpers for selectors
export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
