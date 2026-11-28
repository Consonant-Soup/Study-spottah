'use client';

import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Spot } from '@prisma/client';
import { getSpotTags, getNoiseNumber, toSlug } from './spotHelpers';
import styles from './StudySpotsMap.module.css';

type StudySpotsMapProps = {
  spots: Spot[];
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

function SpotPopup({ spot }: { spot: Spot }) {
  const tags = getSpotTags(spot);
  const noise = getNoiseNumber(spot);

  return (
    <div className={styles.popup}>
      <h4 className={styles.popupTitle}>{spot.name}</h4>
      {spot.description && <p className={styles.popupDesc}>{spot.description}</p>}
      <div className={styles.popupTags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
      <div className={styles.popupLive}>
        <span>Noise: {noise}/5</span>
      </div>
      <Link href={`/spots/${toSlug(spot.name)}`} className={styles.popupLink}>
        View details
      </Link>
    </div>
  );
}

export default function StudySpotsMap({
  spots,
  center = UH_MANOA_CENTER,
  zoom = DEFAULT_ZOOM,
}: StudySpotsMapProps) {
  const spotIcon = createSpotIcon();
  const mappableSpots = spots.filter((s) => s.lat != null && s.lng != null);

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
        {mappableSpots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat!, spot.lng!]} icon={spotIcon}>
            <Popup>
              <SpotPopup spot={spot} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
