/**
 * StudySpotsList.tsx
 * Renders study spots as a scrollable list with name, description, and tags.
 * Pulls from the shared spotData module so map and list stay in sync.
 */

'use client';

import studySpots from './spotData';
import type { StudySpot } from './spotData';
import styles from './StudySpotsList.module.css';

/** Props for the list component */
type StudySpotsListProps = {
  /** Spots to display — defaults to all spots when omitted */
  spots?: StudySpot[];
  onSpotSelect?: (spot: StudySpot) => void;
};

/** Single list row for one study spot */
function SpotRow({ spot, onSelect }: { spot: StudySpot; onSelect?: (spot: StudySpot) => void }) {
  const content = (
    <>
      <span className={styles.spotDot} aria-hidden="true" />
      <div className={styles.spotInfo}>
        <strong className={styles.spotName}>{spot.name}</strong>
        <span className={styles.spotDesc}>{spot.description}</span>
        <div className={styles.spotTags}>
          {spot.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );

  /* If a selection handler is provided, wrap the row in a button */
  if (onSelect) {
    return (
      <li className={styles.row}>
        <button
          type="button"
          className={styles.rowButton}
          onClick={() => onSelect(spot)}
        >
          {content}
        </button>
      </li>
    );
  }

  return <li className={styles.row}>{content}</li>;
}

/** Main list component */
export default function StudySpotsList({ spots = studySpots, onSpotSelect }: StudySpotsListProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <span>STUDY SPOTS</span>
        <span className={styles.spotCount}>{spots.length} spots</span>
      </div>
      <ul className={styles.list}>
        {spots.map((spot) => (
          <SpotRow key={spot.id} spot={spot} onSelect={onSpotSelect} />
        ))}
      </ul>
    </div>
  );
}
