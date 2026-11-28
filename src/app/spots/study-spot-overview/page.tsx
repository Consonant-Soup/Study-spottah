import { getApprovedSpots } from '@/lib/dbActions';
import StudySpotDetailsList from './StudySpotDetailsList';
import styles from './page.module.css';

export default async function StudySpotOverview() {
  const spots = await getApprovedSpots();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Study Spottah</p>
          <h1>Study spot details</h1>
          <p>Review location, amenities, and study conditions for each spot.</p>
        </header>

        {spots.length === 0 ? (
          <p className={styles.empty}>There are no study spots to display yet.</p>
        ) : (
          <StudySpotDetailsList spots={spots} />
        )}
      </div>
    </main>
  );
}
