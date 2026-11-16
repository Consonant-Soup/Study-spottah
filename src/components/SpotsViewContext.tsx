'use client';

import { createContext, useContext, useState } from 'react';

export type SpotsView = 'map' | 'list';

const SpotsViewContext = createContext<{
  view: SpotsView;
  setView: (view: SpotsView) => void;
} | null>(null);

export const SpotsViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<SpotsView>('map');

  return (
    <SpotsViewContext.Provider value={{ view, setView }}>
      {children}
    </SpotsViewContext.Provider>
  );
};

export const useSpotsView = () => {
  const context = useContext(SpotsViewContext);
  if (!context) {
    throw new Error('useSpotsView must be used within a SpotsViewProvider');
  }
  return context;
};
