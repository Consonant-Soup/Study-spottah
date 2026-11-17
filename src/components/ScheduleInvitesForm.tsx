'use client';

import { useState } from 'react';
import styles from './ScheduleInvitesForm.module.css';

type ScheduleInvitesFormProps = {
  sessionDate: string;
  sessionTime: string;
  usernames: string[];
  onUsernamesChange: (usernames: string[]) => void;
  onBack: () => void;
  onSend: () => void;
};

const ScheduleInvitesForm = ({
  sessionDate,
  sessionTime,
  usernames,
  onUsernamesChange,
  onBack,
  onSend,
}: ScheduleInvitesFormProps) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');

  const handleAddUsername = () => {
    // Normalize the display value before checking for duplicate usernames.
    const username = usernameInput.trim().replace(/^@/, '');
    if (!username) {
      setError('Enter a username to add.');
      return;
    }
    if (usernames.some((existing) => existing.toLowerCase() === username.toLowerCase())) {
      setError('That username has already been added.');
      return;
    }

    onUsernamesChange([...usernames, username]);
    setUsernameInput('');
    setError('');
  };

  const handleRemoveUsername = (username: string) => {
    onUsernamesChange(usernames.filter((entry) => entry !== username));
  };

  return (
    <section className={styles.card} aria-labelledby="guest-step-title">
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.stepLabel}>STEP 2 OF 3</p>
          <h2 id="guest-step-title">Invite your study group</h2>
        </div>
        <p className={styles.helper}>{sessionDate} · {sessionTime}</p>
      </div>
      <form
        className={styles.usernameForm}
        onSubmit={(event) => {
          event.preventDefault();
          handleAddUsername();
        }}
      >
        <label htmlFor="username">Username</label>
        <div className={styles.inputRow}>
          <input
            autoComplete="off"
            id="username"
            onChange={(event) => setUsernameInput(event.target.value)}
            placeholder="Enter a username"
            value={usernameInput}
          />
          <button className={styles.secondaryButton} type="submit">Add person</button>
        </div>
        <p className={styles.helper}>This mockup does not check whether usernames exist.</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </form>
      {usernames.length > 0 && (
        <ul className={styles.usernameList} aria-label="Added users">
          {usernames.map((username) => (
            <li key={username}>
              <span>@{username}</span>
              <button
                aria-label={`Remove @${username}`}
                className={styles.removeButton}
                onClick={() => handleRemoveUsername(username)}
                type="button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.cardFooter}>
        <button className={styles.textButton} onClick={onBack} type="button">Back to date</button>
        <button
          className={styles.primaryButton}
          disabled={usernames.length === 0}
          onClick={onSend}
          type="button"
        >
          Send invitations
        </button>
      </div>
    </section>
  );
};

export default ScheduleInvitesForm;
