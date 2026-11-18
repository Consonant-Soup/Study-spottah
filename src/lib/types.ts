/**
 * types.ts
 * Shared TypeScript types. Mirrors the Postgres schema so swapping the mock
 * data for real database rows later needs no component changes.
 */

/** A spot is exactly one of these (single-choice field in the DB). */
export type Setting = "indoor" | "outdoor" | "outdoor_covered";

/** A study spot as the UI needs it. */
export interface Spot {
  id: number;
  name: string;
  building: string;
  description: string;
  setting: Setting;
  tags: string[]; // tag keys, e.g. "microwave"
}

/** One selectable option inside a filter group. */
export interface FilterOption {
  key: string;
  label: string;
}

/** A group of options shown together in the sidebar. */
export interface FilterGroupConfig {
  key: string;
  label: string;
  mode: "single" | "multi"; // single = pick one, multi = pick many
  options: FilterOption[];
}

/** What the user currently has selected. */
export interface FilterState {
  setting: Setting | null; // null = any setting
  tags: string[];          // tag keys; spot must have ALL of them
}
