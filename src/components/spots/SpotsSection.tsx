/**
 * SpotsSection.tsx
 * Client component that ties together the toolbar, map, and list.
 * Owns the filter + view state so the page.tsx can stay a server component.
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import SpotsToolbar from './SpotsToolbar';
import StudySpotsMapWrapper from './StudySpotsMapWrapper';
import StudySpotsList from './StudySpotsList';
import studySpots from './spotData';
import type { StudySpot } from './spotData';
import type { SpotsView } from './SpotsToolbar';
import styles from './SpotsSection.module.css';

type SpotsSectionProps = {
  onSpotSelect?: (spotName: string) => void;
};

export default function SpotsSection({ onSpotSelect }: SpotsSectionProps) {
  const [view, setView] = useState<SpotsView>('map');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null);

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
          ? (
            <StudySpotsMapWrapper
              spots={filteredSpots}
              onSpotSelect={setSelectedSpot}
            />
          )
          : (
            <StudySpotsList
              spots={filteredSpots}
              selectedSpotId={selectedSpot?.id}
              onSpotSelect={setSelectedSpot}
            />
          )}
      </div>

      {selectedSpot && filteredSpots.some((spot) => spot.id === selectedSpot.id) && (
        <div className={styles.selectionActions} aria-live="polite">
          <p>Selected: <strong>{selectedSpot.name}</strong></p>
          <div className={styles.actionButtons}>
            <Link className={styles.detailsLink} href="/spots/study-spot-overview">
              See more details
            </Link>
            {onSpotSelect && (
              <button
                className={styles.sessionButton}
                type="button"
                onClick={() => onSpotSelect(selectedSpot.name)}
              >
                Choose this spot for a session
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
