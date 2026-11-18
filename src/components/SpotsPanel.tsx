'use client';

import { MOCK_SPOTS } from './mock-spots';
import { useSpotsView } from './SpotsViewContext';
import SpotsList from './SpotsList';
import SpotsMap from './SpotsMap';
import SpotsViewToggle from './SpotsViewToggle';
import styles from './SpotsPanel.module.css';

type SpotsPanelProps = {
  onSpotSelect?: (spotName: string) => void;
};

const SpotsPanel = ({ onSpotSelect }: SpotsPanelProps) => {
  const { view } = useSpotsView();

  return (
    <section className={styles.panel} aria-label="Study spots">
      <SpotsViewToggle className="btn btn-outline-success mb-3" />
      {view === 'map'
        ? <SpotsMap />
        : <SpotsList spots={MOCK_SPOTS} onSpotSelect={onSpotSelect} />}
    </section>
  );
};

export default SpotsPanel;
