import styles from './SpotsMap.module.css';

const SpotsMap = () => (
  <section className={styles.mapCard} aria-label="Study spot map wireframe">
    <div className={styles.mapHeader}>
      <span>STUDY SPOT MAP</span>
      <span className={styles.mapStatus}>WIREFRAME</span>
    </div>
    <div className={styles.map}>
      <span className={styles.roadOne} />
      <span className={styles.roadTwo} />
      <span className={styles.roadThree} />
      <span className={`${styles.mapPin} ${styles.pinOne}`} />
      <span className={`${styles.mapPin} ${styles.pinTwo}`} />
      <span className={`${styles.mapPin} ${styles.pinThree}`} />
      <span className={styles.mapLabel}>HONOLULU</span>
    </div>
    <div className={styles.mapFooter}>
      <span>Quiet places</span>
      <span>Transit nearby</span>
      <span>Open now</span>
    </div>
  </section>
);

export default SpotsMap;
