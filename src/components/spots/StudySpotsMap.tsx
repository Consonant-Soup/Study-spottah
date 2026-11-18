/**
 * StudySpotsMap.tsx
 * Leaflet map with study spot markers and popups showing tags + live data.
 * Loaded via dynamic import to avoid SSR issues.
 */

'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import studySpots from './spotData';
import type { StudySpot } from './spotData';
import styles from './StudySpotsMap.module.css';

type StudySpotsMapProps = {
  spots?: StudySpot[];
  center?: [number, number];
  zoom?: number;
};

const UH_MANOA_CENTER: [number, number] = [21.2969, -157.8171];
const DEFAULT_ZOOM = 16;

function createSpotIcon(): L.DivIcon {
  return L.divIcon({
    className: styles.markerIcon,
    iconSize: [27, 27],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  });
}

function SpotPopup({ spot }: { spot: StudySpot }) {
  return (
    <div className={styles.popup}>
      <h4 className={styles.popupTitle}>{spot.name}</h4>
      <p className={styles.popupDesc}>{spot.description}</p>
      <div className={styles.popupTags}>
        {spot.tags.filter((t) => !t.startsWith('No ')).map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
      <div className={styles.popupLive}>
        <span>Noise: {spot.noiseLevel}/7</span>
        <span>Seating: {spot.seating}</span>
      </div>
    </div>
  );
}

export default function StudySpotsMap({
  spots = studySpots,
  center = UH_MANOA_CENTER,
  zoom = DEFAULT_ZOOM,
}: StudySpotsMapProps) {
  const spotIcon = createSpotIcon();

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={center}
        zoom={zoom}
        className={styles.map}
        scrollWheelZoom
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={spotIcon}>
            <Popup>
              <SpotPopup spot={spot} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
