'use client';

import type { Spot } from '@prisma/client';
import { getSpotTags, getNoiseNumber, noiseLabel } from './spotHelpers';
import styles from './StudySpotsList.module.css';

type StudySpotsListProps = {
  spots: Spot[];
  onSpotSelect?: (spot: Spot) => void;
};

function SpotCard({ spot, onSelect }: { spot: Spot; onSelect?: (spot: Spot) => void }) {
  const tags = getSpotTags(spot);
  const noise = getNoiseNumber(spot);

  const inner = (
    <>
      <span className={styles.spotDot} aria-hidden="true" />
      <div className={styles.spotInfo}>
        <strong className={styles.spotName}>{spot.name}</strong>
        {spot.description && (
          <span className={styles.spotDesc}>{spot.description}</span>
        )}

        <div className={styles.spotTags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.liveRow}>
          <span className={styles.liveBadge}>
            <span className={styles.liveLabel}>NOISE</span>
            <span className={styles.noiseBar}>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`${styles.noiseSegment} ${i < noise ? styles.noiseActive : ''}`}
                />
              ))}
            </span>
            <span className={styles.noiseText}>{noise}/5 · {noiseLabel(noise)}</span>
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

export default function StudySpotsList({ spots, onSpotSelect }: StudySpotsListProps) {
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
