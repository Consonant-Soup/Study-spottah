import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StudySpotsMapWrapper from '@/components/spots/StudySpotsMapWrapper';
import StudySpotDetailsList from '../study-spot-overview/StudySpotDetailsList';
import SpotDiscussion from './SpotDiscussion';
import styles from './page.module.css';

export default async function FirstFloorHamiltonLibraryPage() {
  const spot = await prisma.spot.findFirst({
    where: { name: 'First Floor, Hamilton Library' },
  });

  if (!spot) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.backLink} href="/#spots">
          Back to study spots
        </Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Study spot details</p>
          <h1>{spot.name}</h1>
          <p>Location, amenities, and current study conditions.</p>
        </header>
        <StudySpotDetailsList spots={[spot]} />
        {spot.lat != null && spot.lng != null && (
          <section className={styles.mapSection} aria-labelledby="spot-map-title">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Find the spot</p>
              <h2 id="spot-map-title">On the map</h2>
            </div>
            <StudySpotsMapWrapper
              spots={[spot]}
              center={[spot.lat, spot.lng]}
              zoom={17}
            />
          </section>
        )}
        <SpotDiscussion />
      </div>
    </main>
  );
}
