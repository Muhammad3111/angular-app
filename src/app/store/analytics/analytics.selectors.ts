import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ANALYTICS_FEATURE_KEY, AnalyticsState } from './analytics.reducers';

export const selectAnalyticsState = createFeatureSelector<AnalyticsState>(ANALYTICS_FEATURE_KEY);

export const selectAnalytics = createSelector(selectAnalyticsState, (state) => state.analytics);

export const selectAnalyticsLoading = createSelector(
  selectAnalyticsState,
  (state) => state.loading
);

export const selectAnalyticsError = createSelector(selectAnalyticsState, (state) => state.error);

// Qulay derived selectorlar:
export const selectTotalIncomeUzs = createSelector(selectAnalytics, (a) => a.totalIncomeUzs);
export const selectTotalIncomeUsd = createSelector(selectAnalytics, (a) => a.totalIncomeUsd);
export const selectTotalExpenseUzs = createSelector(selectAnalytics, (a) => a.totalExpenseUzs);
export const selectTotalExpenseUsd = createSelector(selectAnalytics, (a) => a.totalExpenseUsd);
export const selectTotalBalanceUzs = createSelector(selectAnalytics, (a) => a.totalBalanceUzs);
export const selectTotalBalanceUsd = createSelector(selectAnalytics, (a) => a.totalBalanceUsd);
