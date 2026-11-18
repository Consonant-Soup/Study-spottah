import styles from './SpotsList.module.css';

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

export default SpotsList;
