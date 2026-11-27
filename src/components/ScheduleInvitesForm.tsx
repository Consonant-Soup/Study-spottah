'use client';

import styles from './ScheduleInvitesForm.module.css';

type ScheduleInvitesFormProps = {
  sessionDate: string;
  sessionTime: string;
  username: string;
  onUsernameChange: (username: string) => void;
  onBack: () => void;
  onSend: () => void;
  isPending: boolean;
  error: string;
};

const ScheduleInvitesForm = ({
  sessionDate,
  sessionTime,
  username,
  onUsernameChange,
  onBack,
  onSend,
  isPending,
  error,
}: ScheduleInvitesFormProps) => {
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
          onSend();
        }}
      >
        <label htmlFor="username">Invitee username</label>
        <div className={styles.inputRow}>
          <input
            autoComplete="off"
            id="username"
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder="Enter a username"
            value={username}
          />
        </div>
        <p className={styles.helper}>Enter the username from their study profile.</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </form>
      <div className={styles.cardFooter}>
        <button className={styles.textButton} onClick={onBack} type="button">Back to date</button>
        <button
          className={styles.primaryButton}
          disabled={!username.trim() || isPending}
          type="submit"
        >
          {isPending ? 'Scheduling...' : 'Send invitation'}
        </button>
      </div>
    </section>
  );
};

export default ScheduleInvitesForm;
