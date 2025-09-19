// src/app/store/orders/order.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as OrdersActions from './order.actions';

export class OrdersEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // API root (o'zingiznikiga moslang)
  private apiUrl = 'http://localhost:3000/api/orders';

  /** Helper: query paramlarni qurish */
  private buildParams(params?: LoadOrdersParams): HttpParams {
    let hp = new HttpParams();
    const p = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 12,
      search: params?.search,
      fromDate: params?.dateFrom,
      toDate: params?.dateTo,
    };
    Object.entries(p).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        hp = hp.set(k, String(v));
      }
    });
    return hp;
  }

  /** Load paginated list */
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      mergeMap(({ params }) =>
        this.http
          .get<OrdersPaginatedResponse>(this.apiUrl, {
            params: this.buildParams(params),
          })
          .pipe(
            map((response) => OrdersActions.loadOrdersSuccess({ response })),
            catchError((e) =>
              of(OrdersActions.loadOrdersFailure({ error: e?.message ?? 'Load error' }))
            )
          )
      )
    )
  );

  /** Load one */
  loadOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrder),
      mergeMap(({ id }) =>
        this.http.get<OrderEntity>(`${this.apiUrl}/${id}`).pipe(
          map((order) => OrdersActions.loadOrderSuccess({ order })),
          catchError((e) =>
            of(OrdersActions.loadOrderFailure({ error: e?.message ?? 'Load one error' }))
          )
        )
      )
    )
  );

  /** Create */
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      mergeMap(({ dto }) =>
        this.http.post<OrderEntity>(this.apiUrl, dto as CreateOrderDto).pipe(
          map((order) => OrdersActions.createOrderSuccess({ order })),
          catchError((e) =>
            of(OrdersActions.createOrderFailure({ error: e?.message ?? 'Create error' }))
          )
        )
      )
    )
  );

  /** Update */
  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrder),
      mergeMap(({ id, changes }) =>
        this.http.put<OrderEntity>(`${this.apiUrl}/${id}`, changes as OrderEntity).pipe(
          map((order) => OrdersActions.updateOrderSuccess({ order })),
          catchError((e) =>
            of(OrdersActions.updateOrderFailure({ error: e?.message ?? 'Update error' }))
          )
        )
      )
    )
  );

  /** Delete */
  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.deleteOrder),
      mergeMap(({ id }) =>
        this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          map(() => OrdersActions.deleteOrderSuccess({ id })),
          catchError((e) =>
            of(OrdersActions.deleteOrderFailure({ error: e?.message ?? 'Delete error' }))
          )
        )
      )
    )
  );
}
