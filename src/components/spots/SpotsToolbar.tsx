/**
 * SpotsToolbar.tsx
 * Horizontal bar with filter chips on the left and a map/list toggle on the right.
 * Filters are driven by the tags in spotData — selecting a filter narrows
 * which spots appear in the map or list.
 */

'use client';

import { useState, useCallback } from 'react';
import studySpots from './spotData';
import styles from './SpotsToolbar.module.css';

/** Collect every unique tag from the spot data */
const ALL_TAGS = Array.from(
  new Set(studySpots.flatMap((s) => s.tags)),
).sort();

/** Which view is active */
export type SpotsView = 'map' | 'list';

type SpotsToolbarProps = {
  /** Currently active view */
  view: SpotsView;
  /** Called when the user toggles between map and list */
  onViewChange: (view: SpotsView) => void;
  /** Currently active filter tags (empty = show all) */
  activeFilters: string[];
  /** Called when the user toggles a filter tag */
  onFilterChange: (filters: string[]) => void;
};

/** Main toolbar component */
export default function SpotsToolbar({
  view,
  onViewChange,
  activeFilters,
  onFilterChange,
}: SpotsToolbarProps) {
  /** Toggle a single filter on or off */
  const toggleFilter = useCallback(
    (tag: string) => {
      if (activeFilters.includes(tag)) {
        onFilterChange(activeFilters.filter((t) => t !== tag));
      } else {
        onFilterChange([...activeFilters, tag]);
      }
    },
    [activeFilters, onFilterChange],
  );

  /** Switch between map and list */
  const toggleView = useCallback(() => {
    onViewChange(view === 'map' ? 'list' : 'map');
  }, [view, onViewChange]);

  return (
    <div className={styles.toolbar}>
      {/* Filter chips */}
      <div className={styles.filters}>
        {ALL_TAGS.map((tag) => {
          const isActive = activeFilters.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
              onClick={() => toggleFilter(tag)}
              aria-pressed={isActive}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Map / list toggle */}
      <button
        type="button"
        className={styles.viewToggle}
        onClick={toggleView}
        aria-label={`Switch to ${view === 'map' ? 'list' : 'map'} view`}
      >
        {view === 'map' ? 'List' : 'Map'}
      </button>
    </div>
  );
}
