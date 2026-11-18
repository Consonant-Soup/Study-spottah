/**
 * SpotList.tsx
 * The main listing (2/3 width). Shows a result count, the cards,
 * or an empty-state message that tells the user how to recover.
 */
import SpotCard from "./SpotCard";
import { Spot } from "../lib/types";
import styles from "./SpotsList.module.css";

export default function SpotsList({ spots }: { spots: Spot[] }) {
  return (
    <section className={styles.list} aria-live="polite">
      <h2 className={styles.count}>
        {spots.length} {spots.length === 1 ? "spot" : "spots"} found
      </h2>

      {spots.length === 0 ? (
        <p className={styles.empty}>
          No spots match all of your filters. Remove a filter to see more.
        </p>
      ) : (
        <div className={styles.grid}>
          {spots.map((spot) => <SpotCard key={spot.id} spot={spot} />)}
        </div>
      )}
    </section>
  );
}

/*import styles from './SpotsList.module.css';

const spots = [
  { name: 'Study spot 1', detail: 'Quiet place' },
  { name: 'Study spot 2', detail: 'Transit nearby' },
  { name: 'Study spot 3', detail: 'Open now' },
];

type SpotsListProps = {
  onSpotSelect?: (spotName: string) => void;
};

const SpotsList = ({ onSpotSelect }: SpotsListProps) => (
  <section className={styles.listCard} aria-label="Study spot list wireframe">
    <div className={styles.listHeader}>
      <span>STUDY SPOTS</span>
      <span className={styles.listStatus}>WIREFRAME</span>
    </div>
    <ul className={styles.list}>
      {spots.map((spot) => (
        <li className={styles.listItem} key={spot.name}>
          {onSpotSelect ? (
            <button
              className={styles.spotButton}
              type="button"
              onClick={() => onSpotSelect(spot.name)}
            >
              <span className={styles.spotIcon} aria-hidden="true" />
              <span>
                <strong>{spot.name}</strong>
                <small>{spot.detail}</small>
              </span>
            </button>
          ) : (
            <>
              <span className={styles.spotIcon} aria-hidden="true" />
              <span>
                <strong>{spot.name}</strong>
                <small>{spot.detail}</small>
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default SpotsList;*/
