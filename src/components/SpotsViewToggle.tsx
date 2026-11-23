'use client';

import { useSpotsView } from './SpotsViewContext';

type Props = {
  className?: string;
};

const SpotsViewToggle = ({ className = '' }: Props) => {
  const { view, setView } = useSpotsView();
  const nextView = view === 'map' ? 'list' : 'map';

  return (
    <button
      type="button"
      className={className}
      onClick={() => setView(nextView)}
      aria-label={`Show study spots as a ${nextView}`}
    >
      Show {nextView}
    </button>
  );
};

export default SpotsViewToggle;
