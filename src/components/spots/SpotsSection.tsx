'use client';

import { useState, useMemo } from 'react';
import type { Spot } from '@prisma/client';
import SpotsToolbar from './SpotsToolbar';
import StudySpotsMapWrapper from './StudySpotsMapWrapper';
import StudySpotsList from './StudySpotsList';
import { getSpotTags } from './spotHelpers';
import type { SpotsView } from './SpotsToolbar';
import styles from './SpotsSection.module.css';

type SpotsSectionProps = {
  spots: Spot[];
  onSpotSelect?: (spotName: string) => void;
};

export default function SpotsSection({ spots, onSpotSelect }: SpotsSectionProps) {
  const [view, setView] = useState<SpotsView>('map');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredSpots = useMemo(() => {
    if (activeFilters.length === 0) return spots;
    return spots.filter((spot) => {
      const tags = getSpotTags(spot);
      return activeFilters.some((tag) => tags.includes(tag));
    });
  }, [spots, activeFilters]);

  return (
    <div className={styles.section}>
      <SpotsToolbar
        view={view}
        onViewChange={setView}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      <div className={styles.content}>
        {view === 'map'
          ? <StudySpotsMapWrapper spots={filteredSpots} />
          : (
            <StudySpotsList
              spots={filteredSpots}
              onSpotSelect={onSpotSelect ? (spot) => onSpotSelect(spot.name) : undefined}
            />
          )}
      </div>
    </div>
  );
}
