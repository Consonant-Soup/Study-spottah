'use client';

import { useSpotsView } from './SpotsViewContext';
import SpotsList from './SpotsList';
import SpotsMap from './SpotsMap';
import SpotsViewToggle from './SpotsViewToggle';
import styles from './SpotsPanel.module.css';

const SpotsPanel = () => {
  const { view } = useSpotsView();

  return (
    <section className={styles.panel} aria-label="Study spots">
      <SpotsViewToggle className="btn btn-outline-success mb-3" />
      {view === 'map' ? <SpotsMap /> : <SpotsList />}
    </section>
  );
};

export default SpotsPanel;
