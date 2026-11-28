import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getApprovedSpots } from '@/lib/dbActions';
import { toSlug } from '@/components/spots/spotHelpers';
import StudySpotsMapWrapper from '@/components/spots/StudySpotsMapWrapper';
import StudySpotDetailsList from '../study-spot-overview/StudySpotDetailsList';
import SpotDiscussion from './SpotDiscussion';
import styles from './page.module.css';

type SpotPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SpotPage({ params }: SpotPageProps) {
  const { slug } = await params;
  const spots = await getApprovedSpots();
  const spot = spots.find((s) => toSlug(s.name) === slug);

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
          <p className={styles.eyebrow}>Study Spot #{spot.id}</p>
          <h1>{spot.name}</h1>
          {spot.description && <p>{spot.description}</p>}
        </header>
        <StudySpotDetailsList spots={[spot]} compact />
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
