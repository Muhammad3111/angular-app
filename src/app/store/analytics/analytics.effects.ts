import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AnalyticsActions from './analytics.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnalyticsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/analytics/global`;

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadAnalytics),
      switchMap(() =>
        this.http.get<Analytics>(this.apiUrl).pipe(
          map((data) => AnalyticsActions.loadAnalyticsSuccess({ analytics: data })),
          catchError((err) =>
            of(
              AnalyticsActions.loadAnalyticsFailure({
                error: err?.error?.message ?? err?.message ?? 'Failed to load analytics',
              })
            )
          )
        )
      )
    )
  );
}
