import { createAction, props } from '@ngrx/store';

export const loadAnalytics = createAction('[Analytics] Load Analytics');
export const loadAnalyticsSuccess = createAction(
  '[Analytics] Load Analytics Success',
  props<{ analytics: Analytics }>()
);
export const loadAnalyticsFailure = createAction(
  '[Analytics] Load Analytics Failure',
  props<{ error: string }>()
);
