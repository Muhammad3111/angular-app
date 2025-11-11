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
        this.http.get<any>(this.apiUrl).pipe(
          map((response) => {
            // Agar backend pagination qo'llab-quvvatlasa
            if (response.data && Array.isArray(response.data)) {
              return RegionsActions.loadRegionsSuccess({
                data: response.data,
                total: response.total || response.data.length,
                page: response.page || page,
                limit: response.limit || limit,
                totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / limit)
              });
            }
            // Agar backend oddiy array qaytarsa (pagination yo'q)
            else if (Array.isArray(response)) {
              // Frontend'da pagination qilamiz
              const startIndex = (page - 1) * limit;
              const endIndex = startIndex + limit;
              const paginatedData = response.slice(startIndex, endIndex);
              
              return RegionsActions.loadRegionsSuccess({
                data: paginatedData,
                total: response.length,
                page: page,
                limit: limit,
                totalPages: Math.ceil(response.length / limit)
              });
            }
            // Noma'lum format
            return RegionsActions.loadRegionsFailure({ error: 'Invalid response format' });
          }),
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
