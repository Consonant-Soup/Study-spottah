import type { Spot } from '@prisma/client';
import { getNoiseNumber, noiseLabel } from '@/components/spots/spotHelpers';
import styles from './page.module.css';

type StudySpotDetailsListProps = {
  spots: Spot[];
  compact?: boolean;
};

const coverageLabel = (c: string) => {
  if (c === 'OUTDOOR_COVERED') return 'Outdoor (Covered)';
  return c.charAt(0) + c.slice(1).toLowerCase();
};

const ynLabel = (val: string) => {
  if (val === 'yes') return 'Yes';
  if (val === 'no') return 'No';
  return 'Unknown';
};

const AMENITY_FIELDS = [
  { key: 'outlets', label: 'Outlets' },
  { key: 'foodAllowed', label: 'Food/Drink Allowed' },
  { key: 'microwave', label: 'Microwave' },
  { key: 'groupstudy', label: 'Group Study' },
  { key: 'ac', label: 'AC' },
  { key: 'printer', label: 'Printer' },
  { key: 'computers', label: 'Computers' },
  { key: 'whiteboard', label: 'Whiteboard' },
  { key: 'projector', label: 'Projector w/ HDMI' },
  { key: 'chalkboard', label: 'Chalkboard' },
  { key: 'windows', label: 'Windows' },
  { key: 'tutors', label: 'TAs' },
  { key: 'freePaper', label: 'Free Paper' },
  { key: 'largeFormatPrinter', label: 'Large Format Printer' },
] as const;

const NEARBY_FIELDS = [
  { key: 'nearBathroom', label: 'Bathroom' },
  { key: 'nearWaterFountain', label: 'Water Fountain' },
  { key: 'nearVendingMachine', label: 'Vending Machine' },
  { key: 'nearFoodStore', label: 'Food Store' },
  { key: 'nearBusStop', label: 'TheBus Stop' },
  { key: 'nearShuttle', label: 'Rainbow Shuttle' },
] as const;

export default function StudySpotDetailsList({ spots, compact }: StudySpotDetailsListProps) {
  return (
    <div className={styles.spotList}>
      {spots.map((spot) => {
        const noise = getNoiseNumber(spot);
        return (
          <article className={styles.spotCard} key={spot.id}>
            {/* Header */}
            <header className={styles.spotHeader}>
              {compact ? (
                <>
                  <p className={styles.spotNumber}>Study spot details</p>
                  <div className={styles.spotMeta}>
                    <span className={styles.badge}>{coverageLabel(spot.coverage)}</span>
                    {spot.location && <span className={styles.location}>{spot.location}</span>}
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.spotNumber}>Study spot #{spot.id}</p>
                  <h2>{spot.name}</h2>
                  {spot.description && <p>{spot.description}</p>}
                  <div className={styles.spotMeta}>
                    <span className={styles.badge}>{coverageLabel(spot.coverage)}</span>
                    {spot.location && <span className={styles.location}>{spot.location}</span>}
                  </div>
                </>
              )}
            </header>

            {/* Noise Level */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Noise Level</h3>
              <div className={styles.noiseRow}>
                <div className={styles.noiseBar}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`${styles.noiseSegment} ${i <= noise ? styles.noiseActive : ''}`}
                    />
                  ))}
                </div>
                <span>{noise}/5 &mdash; {noiseLabel(noise)}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Amenities</h3>
              <dl className={styles.detailGrid}>
                {AMENITY_FIELDS.map((f) => (
                  <div className={styles.detailItem} key={f.key}>
                    <dt>{f.label}</dt>
                    <dd className={styles[`yn_${(spot as Record<string, unknown>)[f.key]}`]}>
                      {ynLabel((spot as Record<string, unknown>)[f.key] as string)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Nearby */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Nearby</h3>
              <dl className={styles.detailGrid}>
                {NEARBY_FIELDS.map((f) => (
                  <div className={styles.detailItem} key={f.key}>
                    <dt>{f.label}</dt>
                    <dd className={styles[`yn_${(spot as Record<string, unknown>)[f.key]}`]}>
                      {ynLabel((spot as Record<string, unknown>)[f.key] as string)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Image */}
            {spot.imageUrl && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionTitle}>Photo</h3>
                <img
                  src={spot.imageUrl}
                  alt={spot.name}
                  className={styles.spotImage}
                />
              </div>
            )}

            {/* Comments */}
            {spot.comments && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionTitle}>Notes</h3>
                <p className={styles.comments}>{spot.comments}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
