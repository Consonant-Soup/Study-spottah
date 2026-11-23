import type { StudySpot } from '@/components/spots/spotData';
import styles from './page.module.css';

type StudySpotDetailsListProps = {
  spots: StudySpot[];
};

const noiseLabel = (level: number) => {
  if (level <= 2) return 'Quiet';
  if (level <= 4) return 'Moderate';
  if (level <= 5) return 'Lively';
  return 'Noisy';
};

/** Render the static campus study spot details. */
export default function StudySpotDetailsList({ spots }: StudySpotDetailsListProps) {
  return (
    <div className={styles.spotList}>
      {spots.map((spot) => (
        <article className={styles.spotCard} key={spot.id}>
          <header className={styles.spotHeader}>
            <p className={styles.spotNumber}>Study spot #{spot.id}</p>
            <h2>{spot.name}</h2>
            <p>{spot.description}</p>
          </header>

          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt>Amenities</dt>
              <dd>{spot.tags.length > 0 ? spot.tags.join(', ') : 'None listed'}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Noise level</dt>
              <dd>{spot.noiseLevel}/7 - {noiseLabel(spot.noiseLevel)}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Seating</dt>
              <dd>{spot.seating}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
