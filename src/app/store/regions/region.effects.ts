import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as RegionsActions from './region.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export class RegionsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/regions`;
  
  // Load
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionsActions.loadRegions),
      mergeMap(({ page = 1, limit = 10 }) =>
        this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`).pipe(
          map((response) => RegionsActions.loadRegionsSuccess({
            data: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
            totalPages: response.totalPages
          })),
          catchError((err) => of(RegionsActions.loadRegionsFailure({ error: err.message })))
        )
      )
    )
  );

  // Create
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionsActions.createRegion),
      mergeMap(({ region }) =>
        this.http.post<any>(this.apiUrl, region).pipe(
          map((newRegion) => RegionsActions.createRegionSuccess({ region: newRegion })),
          catchError((err) => of(RegionsActions.createRegionFailure({ error: err.message })))
        )
      )
    )
  );

  // Update
  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionsActions.updateRegion),
      mergeMap(({ id, changes }) =>
        this.http.put<any>(`${this.apiUrl}/${id}`, changes).pipe(
          map((updated) => RegionsActions.updateRegionSuccess({ region: updated })),
          catchError((err) => of(RegionsActions.updateRegionFailure({ error: err.message })))
        )
      )
    )
  );

  // Delete
  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionsActions.deleteRegion),
      mergeMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => RegionsActions.deleteRegionSuccess({ id })),
          catchError((err) => of(RegionsActions.deleteRegionFailure({ error: err.message })))
        )
      )
    )
  );
}
