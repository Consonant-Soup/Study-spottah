/**
 * SpotsToolbar.tsx
 * "FILTER" label + filter chips (ordered by category) + map/list toggle.
 */

'use client';

import { useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { TAG_ORDER } from './spotData';
import styles from './SpotsToolbar.module.css';

export type SpotsView = 'map' | 'list';

type SpotsToolbarProps = {
  view: SpotsView;
  onViewChange: (view: SpotsView) => void;
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
};

export default function SpotsToolbar({
  view,
  onViewChange,
  activeFilters,
  onFilterChange,
}: SpotsToolbarProps) {
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

  const toggleView = useCallback(() => {
    onViewChange(view === 'map' ? 'list' : 'map');
  }, [view, onViewChange]);

  return (
    <div className={styles.toolbar}>
      <span className={styles.filterLabel}>
        <SlidersHorizontal size={14} />
        FILTER
      </span>
      <div className={styles.filters}>
        {TAG_ORDER.map((tag) => {
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
