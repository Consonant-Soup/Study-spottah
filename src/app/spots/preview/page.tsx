/**
 * spots/preview/page.tsx
 * Temporary preview page to test the map and list components in isolation.
 * Remove this once the components are integrated into the home page.
 */

'use client';

import { useState } from 'react';
import { StudySpotsMap, StudySpotsList } from '@/components/spots';

export default function SpotsPreview() {
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#000', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        Spots Component Preview
      </h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setView('map')}
          style={{
            padding: '0.4rem 1rem',
            border: '1px solid #91a8eb',
            background: view === 'map' ? '#91a8eb' : '#fff',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          style={{
            padding: '0.4rem 1rem',
            border: '1px solid #91a8eb',
            background: view === 'list' ? '#91a8eb' : '#fff',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          List
        </button>
      </div>
      {view === 'map' ? <StudySpotsMap spots={[]} /> : <StudySpotsList spots={[]} />}
    </div>
  );
}
