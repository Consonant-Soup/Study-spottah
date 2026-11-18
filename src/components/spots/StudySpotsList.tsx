/**
 * StudySpotsList.tsx
 * Card grid showing study spots with amenity tags and live indicators.
 */

'use client';

import studySpots from './spotData';
import type { StudySpot } from './spotData';
import styles from './StudySpotsList.module.css';

type StudySpotsListProps = {
  spots?: StudySpot[];
  onSpotSelect?: (spot: StudySpot) => void;
};

/** Noise level label */
function noiseLabel(level: number): string {
  if (level <= 2) return 'Quiet';
  if (level <= 4) return 'Moderate';
  if (level <= 5) return 'Lively';
  return 'Noisy';
}

function SpotCard({ spot, onSelect }: { spot: StudySpot; onSelect?: (spot: StudySpot) => void }) {
  const inner = (
    <>
      <span className={styles.spotDot} aria-hidden="true" />
      <div className={styles.spotInfo}>
        <strong className={styles.spotName}>{spot.name}</strong>
        <span className={styles.spotDesc}>{spot.description}</span>

        {/* Amenity tags */}
        <div className={styles.spotTags}>
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Live indicators */}
        <div className={styles.liveRow}>
          <span className={styles.liveBadge}>
            <span className={styles.liveLabel}>NOISE</span>
            <span className={styles.noiseBar}>
              {Array.from({ length: 7 }, (_, i) => (
                <span
                  key={i}
                  className={`${styles.noiseSegment} ${i < spot.noiseLevel ? styles.noiseActive : ''}`}
                />
              ))}
            </span>
            <span className={styles.noiseText}>{spot.noiseLevel}/7 · {noiseLabel(spot.noiseLevel)}</span>
          </span>
          <span className={styles.liveBadge}>
            <span className={styles.liveLabel}>SEATING</span>
            <span className={styles.seatingText}>{spot.seating}</span>
          </span>
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <li className={styles.row}>
        <button type="button" className={styles.rowButton} onClick={() => onSelect(spot)}>
          {inner}
        </button>
      </li>
    );
  }

  return <li className={styles.row}>{inner}</li>;
}

export default function StudySpotsList({ spots = studySpots, onSpotSelect }: StudySpotsListProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <span>STUDY SPOTS</span>
        <span className={styles.spotCount}>{spots.length} spots</span>
      </div>
      <ul className={styles.list}>
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} onSelect={onSpotSelect} />
        ))}
      </ul>
    </div>
  );
}
