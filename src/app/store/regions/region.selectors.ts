import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegionsState } from './region.reducer';

export const selectRegionsState = createFeatureSelector<RegionsState>('regions');

export const selectAllRegions = createSelector(selectRegionsState, (state) => state.regions);

export const selectRegionsLoading = createSelector(selectRegionsState, (state) => state.loading);

export const selectRegionsError = createSelector(selectRegionsState, (state) => state.error);
