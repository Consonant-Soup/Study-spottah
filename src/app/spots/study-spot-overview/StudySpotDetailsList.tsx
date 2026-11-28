import type { Spot } from '@prisma/client';
import { getSpotTags, getNoiseNumber, noiseLabel } from '@/components/spots/spotHelpers';
import styles from './page.module.css';

type StudySpotDetailsListProps = {
  spots: Spot[];
};

export default function StudySpotDetailsList({ spots }: StudySpotDetailsListProps) {
  return (
    <div className={styles.spotList}>
      {spots.map((spot) => {
        const tags = getSpotTags(spot);
        const noise = getNoiseNumber(spot);
        return (
          <article className={styles.spotCard} key={spot.id}>
            <header className={styles.spotHeader}>
              <p className={styles.spotNumber}>Study spot #{spot.id}</p>
              <h2>{spot.name}</h2>
              {spot.description && <p>{spot.description}</p>}
            </header>

            <dl className={styles.details}>
              <div className={styles.detail}>
                <dt>Amenities</dt>
                <dd>{tags.length > 0 ? tags.join(', ') : 'None listed'}</dd>
              </div>
              <div className={styles.detail}>
                <dt>Noise level</dt>
                <dd>{noise}/5 - {noiseLabel(noise)}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
