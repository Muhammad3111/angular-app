import { createReducer, on } from '@ngrx/store';
import * as RegionsActions from './region.action';

export interface RegionsState {
  regions: any[];
  loading: boolean;
  error: string | null;

  stats: any[];
  statsLoading: boolean;
  statsError: string | null;
}

export const initialState: RegionsState = {
  regions: [],
  loading: false,
  error: null,

  stats: [],
  statsLoading: false,
  statsError: null,
};

export const regionsReducer = createReducer(
  initialState,
  // Load
  on(RegionsActions.loadRegions, (state) => ({ ...state, loading: true })),
  on(RegionsActions.loadRegionsSuccess, (state, { regions }) => ({
    ...state,
    loading: false,
    regions,
  })),
  on(RegionsActions.loadRegionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(RegionsActions.createRegionSuccess, (state, { region }) => ({
    ...state,
    regions: [...state.regions, region],
  })),

  // Update
  on(RegionsActions.updateRegionSuccess, (state, { region }) => ({
    ...state,
    regions: state.regions.map((r) => (r.id === region.id ? region : r)),
  })),

  // Delete
  on(RegionsActions.deleteRegionSuccess, (state, { id }) => ({
    ...state,
    regions: state.regions.filter((r) => r.id !== id),
  }))
);
