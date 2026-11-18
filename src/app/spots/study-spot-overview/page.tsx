import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import StudySpotDetailsList from './StudySpotDetailsList';
import styles from './page.module.css';

type StudySpotOverviewProps = {
  searchParams: Promise<{ updated?: string }>;
};

/** Show spot details, bypassing login protection only during development. */
export default async function StudySpotOverview({ searchParams }: StudySpotOverviewProps) {
  const isProduction = process.env.NODE_ENV === 'production';
  const session = isProduction ? await auth() : null;

  // Skip the login redirect in development so the overview can be previewed locally.
  // loggedInProtectedPage(session as { user: { email: string; id: string; name: string } } | null);
  if (isProduction) {
    loggedInProtectedPage(
      session as {
        user: { email: string; id: string; name: string };
      } | null,
    );
  }

  const [spots, params] = await Promise.all([
    prisma.spot.findMany({ orderBy: { location: 'asc' } }),
    searchParams,
  ]);
  // Make the edit form available locally; keep admin-only editing in production.
  const isAdmin = !isProduction || session?.user?.role === 'ADMIN';

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Study Spottah</p>
          <h1>Study spot details</h1>
          <p>Review location, amenities, and study conditions for each spot.</p>
        </header>

        {params.updated === '1' && (
          <p className={styles.success} role="status">
            Study spot details were updated.
          </p>
        )}

        {spots.length === 0 ? (
          <p className={styles.empty}>There are no study spots to display yet.</p>
        ) : (
          <StudySpotDetailsList spots={spots} isAdmin={isAdmin} />
        )}
      </div>
    </main>
  );
}
