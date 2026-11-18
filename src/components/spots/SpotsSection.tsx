/**
 * SpotsSection.tsx
 * Client component that ties together the toolbar, map, and list.
 * Owns the filter + view state so the page.tsx can stay a server component.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import SpotsToolbar from './SpotsToolbar';
import StudySpotsMapWrapper from './StudySpotsMapWrapper';
import StudySpotsList from './StudySpotsList';
import studySpots from './spotData';
import type { SpotsView } from './SpotsToolbar';
import styles from './SpotsSection.module.css';

export default function SpotsSection() {
  const [view, setView] = useState<SpotsView>('map');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  /** Filter spots — show all when no filters are active */
  const filteredSpots = useMemo(() => {
    if (activeFilters.length === 0) return studySpots;
    return studySpots.filter((spot) =>
      activeFilters.some((tag) => spot.tags.includes(tag)),
    );
  }, [activeFilters]);

  return (
    <div className={styles.section}>
      {/* Toolbar: filter chips + view toggle */}
      <SpotsToolbar
        view={view}
        onViewChange={setView}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      {/* Map or list, depending on toggle */}
      <div className={styles.content}>
        {view === 'map'
          ? <StudySpotsMapWrapper spots={filteredSpots} />
          : <StudySpotsList spots={filteredSpots} />}
      </div>
    </div>
  );
}
