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
      height: '24rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9f9',
      color: '#000',
      fontSize: '11px',
      fontWeight: 900,
      letterSpacing: '1px',
    }}
    >
      LOADING MAP...
    </div>
  ),
});

/** Props passed through to the inner map component */
type StudySpotsMapWrapperProps = {
  spots?: StudySpot[];
};

/** Wrapper that forwards props to the dynamically imported map */
export default function StudySpotsMapWrapper({ spots }: StudySpotsMapWrapperProps) {
  return <StudySpotsMapInner spots={spots} />;
}
