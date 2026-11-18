/**
 * SpotCard.tsx
 * Displays one study spot: name, setting badge, building, description, tags.
 * Purely presentational: all data arrives through the `spot` prop.
 */
import { labelFor } from "@/lib/tag-labels";
import type { Spot } from "../lib/types";
import styles from "./SpotCard.module.css";

type SpotCardProps = {
  spot: Spot;
  onSpotSelect?: (spotName: string) => void;
};

export default function SpotCard({ spot, onSpotSelect }: SpotCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.name}>
          {onSpotSelect ? (
            <button
              type="button"
              className={styles.nameButton}
              onClick={() => onSpotSelect(spot.name)}
            >
              {spot.name}
            </button>
          ) : spot.name}
        </h3>
        {/* Setting badge: indoor / outdoor / outdoor with cover */}
        <span className={styles.setting}>{labelFor(spot.setting)}</span>
      </header>
      <p className={styles.building}>{spot.building}</p>
      <p>{spot.description}</p>
      <ul className={styles.tags}>
        {spot.tags.map((tag) => (
          <li key={tag} className={styles.tag}>{labelFor(tag)}</li>
        ))}
      </ul>
    </article>
  );
}
