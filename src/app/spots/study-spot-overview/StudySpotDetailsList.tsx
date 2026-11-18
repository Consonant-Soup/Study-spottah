import { Major, NoiseLevel, YesNoUnknown, type Spot } from '@prisma/client';
import { updateStudySpot } from './actions';
import styles from './page.module.css';

type StudySpotDetailsListProps = {
  spots: Spot[];
  isAdmin: boolean;
};

const YES_NO_FIELDS = [
  { name: 'outdoors', label: 'Outdoors' },
  { name: 'ac', label: 'Air conditioning' },
  { name: 'microwave', label: 'Microwave' },
  { name: 'outlets', label: 'Power outlets' },
  { name: 'windows', label: 'Windows' },
  { name: 'groupstudy', label: 'Group study' },
  { name: 'tutors', label: 'Tutors available' },
  { name: 'printer', label: 'Printer' },
  { name: 'foodAllowed', label: 'Food allowed' },
  { name: 'seating', label: 'Seating' },
  { name: 'computers', label: 'Computers' },
] as const;

const NOISE_LEVELS = [
  { value: NoiseLevel.LEVEL_1, label: '1 - Silent' },
  { value: NoiseLevel.LEVEL_2, label: '2 - Very quiet' },
  { value: NoiseLevel.LEVEL_3, label: '3 - Low whisper' },
  { value: NoiseLevel.LEVEL_4, label: '4 - Moderate background' },
  { value: NoiseLevel.LEVEL_5, label: '5 - Conversational' },
  { value: NoiseLevel.LEVEL_6, label: '6 - Lively / group study' },
  { value: NoiseLevel.LEVEL_7, label: '7 - Loud / high traffic' },
] as const;

const formatValue = (value: YesNoUnknown) => (
  value.charAt(0).toUpperCase() + value.slice(1)
);

const noiseLabel = (value: NoiseLevel) => (
  NOISE_LEVELS.find((level) => level.value === value)?.label ?? value
);

/** Render a reusable details card for each spot, with editing controls for admins. */
export default function StudySpotDetailsList({ spots, isAdmin }: StudySpotDetailsListProps) {
  return (
    <div className={styles.spotList}>
      {spots.map((spot) => (
        <article className={styles.spotCard} key={spot.id}>
          <header className={styles.spotHeader}>
            <div>
              <p className={styles.spotNumber}>Study spot #{spot.id}</p>
              <h2>{spot.location}</h2>
            </div>
          </header>

          <dl className={styles.details}>
            {YES_NO_FIELDS.map((field) => (
              <div className={styles.detail} key={field.name}>
                <dt>{field.label}</dt>
                <dd>{formatValue(spot[field.name])}</dd>
              </div>
            ))}
            <div className={styles.detail}>
              <dt>Noise level</dt>
              <dd>{noiseLabel(spot.noiselvl)}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Majors</dt>
              <dd>{spot.majors.length > 0 ? spot.majors.join(', ') : 'Not specified'}</dd>
            </div>
          </dl>

          {isAdmin && (
            <details className={styles.editor}>
              <summary>Edit study spot</summary>
              <form action={updateStudySpot} className={styles.form}>
                <input type="hidden" name="id" value={spot.id} />

                <label className={styles.field}>
                  <span>Location</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="location"
                    defaultValue={spot.location}
                    required
                  />
                </label>

                <div className={styles.formGrid}>
                  {YES_NO_FIELDS.map((field) => (
                    <label className={styles.field} key={field.name}>
                      <span>{field.label}</span>
                      <select
                        className={styles.input}
                        name={field.name}
                        defaultValue={spot[field.name]}
                      >
                        {Object.values(YesNoUnknown).map((value) => (
                          <option key={value} value={value}>{formatValue(value)}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>

                <label className={styles.field}>
                  <span>Noise level</span>
                  <select className={styles.input} name="noiselvl" defaultValue={spot.noiselvl}>
                    {NOISE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </label>

                <fieldset className={styles.majors}>
                  <legend>Majors</legend>
                  {Object.values(Major).map((major) => (
                    <label className={styles.checkOption} key={major}>
                      <input
                        type="checkbox"
                        name="majors"
                        value={major}
                        defaultChecked={spot.majors.includes(major)}
                      />
                      {major}
                    </label>
                  ))}
                </fieldset>

                <button className={styles.submit} type="submit">Save changes</button>
              </form>
            </details>
          )}
        </article>
      ))}
    </div>
  );
}
