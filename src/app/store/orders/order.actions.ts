// src/app/store/orders/order.actions.ts
import { createAction, props } from '@ngrx/store';

/** List (paginated) */
export const loadOrders = createAction(
  '[Orders] Load',
  props<{ params?: LoadOrdersParams }>() // page, limit, filter...
);

export const loadOrdersSuccess = createAction(
  '[Orders] Load Success',
  props<{ response: OrdersPaginatedResponse }>() // { data, total, page, limit, totalPages }
);

export const loadOrdersFailure = createAction('[Orders] Load Failure', props<{ error: string }>());

/** One */
export const loadOrder = createAction('[Orders] Load One', props<{ id: string }>());

export const loadOrderSuccess = createAction(
  '[Orders] Load One Success',
  props<{ order: OrderEntity }>()
);

export const loadOrderFailure = createAction(
  '[Orders] Load One Failure',
  props<{ error: string }>()
);

/** Create */
export const createOrder = createAction('[Orders] Create', props<{ dto: CreateOrderDto }>());

export const createOrderSuccess = createAction(
  '[Orders] Create Success',
  props<{ order: OrderEntity }>()
);

export const createOrderFailure = createAction(
  '[Orders] Create Failure',
  props<{ error: string }>()
);

/** Update */
export const updateOrder = createAction(
  '[Orders] Update',
  props<{ id: string; changes: OrderEntity }>()
);

export const updateOrderSuccess = createAction(
  '[Orders] Update Success',
  props<{ order: OrderEntity }>()
);

export const updateOrderFailure = createAction(
  '[Orders] Update Failure',
  props<{ error: string }>()
);

/** Delete */
export const deleteOrder = createAction('[Orders] Delete', props<{ id: string }>());

export const deleteOrderSuccess = createAction('[Orders] Delete Success', props<{ id: string }>());

export const deleteOrderFailure = createAction(
  '[Orders] Delete Failure',
  props<{ error: string }>()
);

/** UI tanlovlari uchun (ixtiyoriy) */
export const selectOrder = createAction('[Orders] Select', props<{ id: string | null }>());
