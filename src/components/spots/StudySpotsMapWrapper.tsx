'use client';

import dynamic from 'next/dynamic';
import type { Spot } from '@prisma/client';

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

type StudySpotsMapWrapperProps = {
  spots: Spot[];
  center?: [number, number];
  zoom?: number;
};

export default function StudySpotsMapWrapper({ spots, center, zoom }: StudySpotsMapWrapperProps) {
  return <StudySpotsMapInner spots={spots} center={center} zoom={zoom} />;
}
