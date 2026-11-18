/**
 * page.tsx
 * Home page — hero with mission statement, then filter bar + campus map.
 * More sections will be added below the map.
 */

import SpotsSection from '@/components/spots/SpotsSection';
import styles from './page.module.css';

const Home = () => (
  <main className={styles.page}>
    {/* Hero / mission section — full width, green background */}
    <section className={styles.hero}>
      <h1 className={styles.title}>Study Spottah</h1>
      <p className={styles.mission}>Find your next study spot at UH Mānoa.</p>
    </section>

    {/* Map area — purple background, toolbar + map/list inside */}
    <section className={styles.mapArea}>
      <SpotsSection />
    </section>
  </main>
);

export default Home;
