/**
 * StudySpotsMap.tsx
 * Renders an interactive Leaflet map centered on UH Manoa campus.
 * Each study spot appears as a clickable marker with a popup.
 *
 * This is a client component because Leaflet requires browser APIs.
 * Loaded via dynamic import in StudySpotsMapWrapper to avoid SSR issues.
 */

'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import studySpots from './spotData';
import type { StudySpot } from './spotData';
import styles from './StudySpotsMap.module.css';

type StudySpotsMapProps = {
  /** Spots to display — defaults to all spots when omitted */
  spots?: StudySpot[];
};

/** UH Manoa campus center coordinates */
const UH_MANOA_CENTER: [number, number] = [21.2969, -157.8171];
const DEFAULT_ZOOM = 16;

/** Custom marker icon using the main theme color (#91a8eb) */
function createSpotIcon(): L.DivIcon {
  return L.divIcon({
    className: styles.markerIcon,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

/** Builds the popup content for a single study spot */
function SpotPopup({ spot }: { spot: StudySpot }) {
  return (
    <div className={styles.popup}>
      <h4 className={styles.popupTitle}>{spot.name}</h4>
      <p className={styles.popupDesc}>{spot.description}</p>
      <div className={styles.popupTags}>
        {spot.tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/** Main map component — renders Leaflet map with study spot markers */
export default function StudySpotsMap({ spots = studySpots }: StudySpotsMapProps) {
  const spotIcon = createSpotIcon();

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={UH_MANOA_CENTER}
        zoom={DEFAULT_ZOOM}
        className={styles.map}
        scrollWheelZoom
        attributionControl
      >
        {/* OpenStreetMap tile layer — free, no API key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render a marker for each study spot */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={spotIcon}
          >
            <Popup>
              <SpotPopup spot={spot} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
