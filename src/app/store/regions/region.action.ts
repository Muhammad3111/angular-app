import { createAction, props } from '@ngrx/store';

// Load
export const loadRegions = createAction('[Regions] Load Regions');
export const loadRegionsSuccess = createAction(
  '[Regions] Load Regions Success',
  props<{ regions: RegionModel[] }>()
);
export const loadRegionsFailure = createAction(
  '[Regions] Load Regions Failure',
  props<{ error: string }>()
);

// Create
export const createRegion = createAction(
  '[Regions] Create Region',
  props<{ region: { name: string } }>()
);
export const createRegionSuccess = createAction(
  '[Regions] Create Region Success',
  props<{ region: RegionModel }>()
);
export const createRegionFailure = createAction(
  '[Regions] Create Region Failure',
  props<{ error: string }>()
);

// Update
export const updateRegion = createAction(
  '[Regions] Update Region',
  props<{ id: string; changes: Partial<RegionModel> }>()
);
export const updateRegionSuccess = createAction(
  '[Regions] Update Region Success',
  props<{ region: RegionModel }>()
);
export const updateRegionFailure = createAction(
  '[Regions] Update Region Failure',
  props<{ error: string }>()
);

// Delete
export const deleteRegion = createAction('[Regions] Delete Region', props<{ id: string }>());
export const deleteRegionSuccess = createAction(
  '[Regions] Delete Region Success',
  props<{ id: string }>()
);
export const deleteRegionFailure = createAction(
  '[Regions] Delete Region Failure',
  props<{ error: string }>()
);
