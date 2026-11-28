/**
 * page.tsx
 * Home page — brutalist editorial design matching the Transit page.
 * Topline bar, hero with sticker, info strip, spots section, tips.
 */

import { MapPin, Filter, Clock, BookOpen, Coffee, Users, ArrowUpRight } from 'lucide-react';
import SpotsSection from '@/components/spots/SpotsSection';
import { getApprovedSpots } from '@/lib/dbActions';
import styles from './page.module.css';

const Home = async () => {
  const spots = await getApprovedSpots();
  return (
  <main className={styles.page}>
    {/* Purple accent bar */}
    <div className={styles.topline}>
      <span>CAMPUS STUDY SPOTS, SORTED</span>
      <span>UH MĀNOA · HONOLULU, HI</span>
    </div>

    <div className={styles.main}>
      {/* Hero — big heading with sticker */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroPulse} />
            FIND YOUR NEXT SPOT
          </div>
          <h1>
            Study<br />Spottah<span className={styles.titleStar}>.</span>
          </h1>
          <p>
            Discover the best places to study at UH Mānoa. Filter by vibe,
            check the map, and find your next session spot.
          </p>
          <div className={styles.heroCtas}>
            <a className={styles.primaryCta} href="#spots">
              Explore the map <span>→</span>
            </a>
            <a className={styles.secondaryCta} href="/schedule">
              Schedule a session
            </a>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroSticker}>
            <span className={styles.stickerSun}>✦</span>
            <strong>FIND YOUR FOCUS.</strong>
            <span className={styles.stickerCorner}>📍</span>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className={styles.infoStrip}>
        <div>
          <span className={styles.stripIcon}><MapPin size={18} /></span>
          <strong>10 study spots</strong>
          <span>Across UH Mānoa campus</span>
        </div>
        <div>
          <span className={styles.stripIcon}><Filter size={18} /></span>
          <strong>8 filter tags</strong>
          <span>AC · Outlets · Food &amp; more</span>
        </div>
        <div>
          <span className={styles.stripIcon}><Clock size={18} /></span>
          <strong>Updated live</strong>
          <span>Real campus locations</span>
        </div>
      </div>

      {/* Map & spots section */}
      <section id="spots" className={styles.spotsArea}>
        <div className={styles.panelHead}>
          <div>
            <span className={styles.eyebrow}>EXPLORE CAMPUS</span>
            <h2>Where to study<span className={styles.titleStar}>*</span></h2>
          </div>
        </div>
        <SpotsSection spots={spots} />
      </section>

      {/* Tips section */}
      <section className={styles.tips}>
        <div className={styles.tipsHead}>
          <span className={styles.eyebrow}>STUDY TIPS</span>
          <h2>Make the most of campus.</h2>
        </div>
        <article>
          <span className={styles.tipNumber}>01</span>
          <BookOpen size={28} />
          <h3>Find your vibe</h3>
          <p>
            Use the filter tags to narrow down spots that match your study
            style — quiet, social, outdoors, or near food.
          </p>
        </article>
        <article>
          <span className={styles.tipNumber}>02</span>
          <Coffee size={28} />
          <h3>Fuel up nearby</h3>
          <p>
            Spots tagged &ldquo;Food Allowed&rdquo; let you bring snacks.
            Check for a microwave tag if you need to heat something up.
          </p>
        </article>
        <article>
          <span className={styles.tipNumber}>03</span>
          <Users size={28} />
          <h3>Study together</h3>
          <p>
            Some spots are great for group sessions. Look for social-friendly
            locations and invite your friends.
          </p>
          <a href="/schedule">Schedule a session <ArrowUpRight size={13} /></a>
        </article>
      </section>
    </div>
  </main>
  );
};

export default Home;
