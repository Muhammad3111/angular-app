import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegionsState } from './region.reducer';

export const selectRegionsState = createFeatureSelector<RegionsState>('regions');

export const selectAllRegions = createSelector(selectRegionsState, (state) => state.regions);

export const selectRegionsLoading = createSelector(selectRegionsState, (state) => state.loading);

export const selectRegionsError = createSelector(selectRegionsState, (state) => state.error);

export const selectRegionsTotal = createSelector(selectRegionsState, (state) => state.total);

export const selectRegionsPage = createSelector(selectRegionsState, (state) => state.page);

export const selectRegionsLimit = createSelector(selectRegionsState, (state) => state.limit);

export const selectRegionsTotalPages = createSelector(selectRegionsState, (state) => state.totalPages);
