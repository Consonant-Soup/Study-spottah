/**
 * StudySpotsMapWrapper.tsx
 * Dynamic import wrapper for the Leaflet map component.
 * Leaflet accesses `window` on import, so it must be loaded client-side only.
 * Next.js dynamic() with ssr: false handles this.
 */

'use client';

import dynamic from 'next/dynamic';
import type { StudySpot } from './spotData';

/** Dynamically import the map — no server-side rendering */
const StudySpotsMapInner = dynamic(() => import('./StudySpotsMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fc',
      color: '#000',
      fontSize: '0.85rem',
    }}
    >
      Loading map...
    </div>
  ),
});

/** Props passed through to the inner map component */
type StudySpotsMapWrapperProps = {
  spots?: StudySpot[];
  onSpotSelect?: (spot: StudySpot) => void;
};

/** Wrapper that forwards props to the dynamically imported map */
export default function StudySpotsMapWrapper({
  spots,
  onSpotSelect,
}: StudySpotsMapWrapperProps) {
  return <StudySpotsMapInner spots={spots} onSpotSelect={onSpotSelect} />;
}
