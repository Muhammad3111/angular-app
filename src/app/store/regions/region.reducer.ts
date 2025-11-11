import { createReducer, on } from '@ngrx/store';
import * as RegionsActions from './region.action';

export interface RegionsState {
  regions: any[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  stats: any[];
  statsLoading: boolean;
  statsError: string | null;
}

export const initialState: RegionsState = {
  regions: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,

  stats: [],
  statsLoading: false,
  statsError: null,
};

export const regionsReducer = createReducer(
  initialState,
  // Load
  on(RegionsActions.loadRegions, (state) => ({ ...state, loading: true })),
  on(RegionsActions.loadRegionsSuccess, (state, { data, total, page, limit, totalPages }) => ({
    ...state,
    loading: false,
    regions: data,
    total,
    page,
    limit,
    totalPages,
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
