/**
 * spots/index.ts
 * Barrel exports for the study spots module.
 * Import from '@/components/spots' to get any spot component or data.
 */

export { default as StudySpotsMap } from './StudySpotsMapWrapper';
export { default as StudySpotsList } from './StudySpotsList';
export { default as SpotsToolbar } from './SpotsToolbar';
export { default as studySpots } from './spotData';
export type { StudySpot } from './spotData';
export type { SpotsView } from './SpotsToolbar';
