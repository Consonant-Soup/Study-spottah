import studySpots from '@/components/spots/spotData';
import StudySpotDetailsList from './StudySpotDetailsList';
import styles from './page.module.css';

/** Show the campus study spots without requiring a database connection. */
export default function StudySpotOverview() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Study Spottah</p>
          <h1>Study spot details</h1>
          <p>Review location, amenities, and study conditions for each spot.</p>
        </header>

        {studySpots.length === 0 ? (
          <p className={styles.empty}>There are no study spots to display yet.</p>
        ) : (
          <StudySpotDetailsList spots={studySpots} />
        )}
      </div>
    </main>
  );
}
