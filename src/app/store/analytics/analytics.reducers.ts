import { createReducer, on } from '@ngrx/store';
import * as AnalyticsActions from './analytics.actions';

export const ANALYTICS_FEATURE_KEY = 'analytics' as const;

export interface AnalyticsState {
  analytics: Analytics;
  loading: boolean;
  error: string | null;
}

export const initialState: AnalyticsState = {
  analytics: {
    totalBalanceUzs: 0,
    totalBalanceUsd: 0,
    totalExpenseUsd: 0,
    totalExpenseUzs: 0,
    totalIncomeUsd: 0,
    totalIncomeUzs: 0,
    totalFlowBalanceUzs: 0,
    totalFlowBalanceUsd: 0,
  },
  loading: false,
  error: null,
};

export const analyticsReducer = createReducer(
  initialState,
  on(AnalyticsActions.loadAnalytics, (state) => ({ ...state, loading: true, error: null })),
  on(AnalyticsActions.loadAnalyticsSuccess, (state, { analytics }) => ({
    ...state,
    loading: false,
    analytics: {
      ...initialState.analytics,
      ...analytics,
    },
  })),
  on(AnalyticsActions.loadAnalyticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
