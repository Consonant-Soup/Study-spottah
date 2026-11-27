'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { lookupInviteeForMeeting } from '@/app/schedule/actions';
import styles from './ScheduleInvitesForm.module.css';

export type MeetingInvitee = {
  username: string;
  name: string;
};

type ScheduleInvitesFormProps = {
  sessionDate: string;
  sessionTime: string;
  invitees: MeetingInvitee[];
  onInviteesChange: (invitees: MeetingInvitee[]) => void;
  onBack: () => void;
  onSend: () => void;
  isPending: boolean;
  error: string;
};

const ScheduleInvitesForm = ({
  sessionDate,
  sessionTime,
  invitees,
  onInviteesChange,
  onBack,
  onSend,
  isPending,
  error,
}: ScheduleInvitesFormProps) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddInvitee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = usernameInput.trim().replace(/^@/, '');
    if (!username) {
      setAddError('Enter a username to add.');
      return;
    }
    if (invitees.some((invitee) => invitee.username.toLowerCase() === username.toLowerCase())) {
      setAddError('That person is already on the invite list.');
      return;
    }

    setAddError('');
    setIsAdding(true);
    try {
      const result = await lookupInviteeForMeeting(username);
      if (result.error || !result.invitee) {
        setAddError(result.error ?? 'That user could not be found.');
        return;
      }

      onInviteesChange([...invitees, result.invitee]);
      setUsernameInput('');
    } finally {
      setIsAdding(false);
    }
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
      <form className={styles.usernameForm} onSubmit={handleAddInvitee}>
        <label htmlFor="username">Invitee username</label>
        <div className={styles.inputRow}>
          <input
            autoComplete="off"
            id="username"
            onChange={(event) => setUsernameInput(event.target.value)}
            placeholder="Enter a username"
            value={usernameInput}
          />
          <button
            className={styles.secondaryButton}
            disabled={isAdding || !usernameInput.trim()}
            type="submit"
          >
            {isAdding ? 'Checking...' : 'Add person'}
          </button>
        </div>
        <p className={styles.helper}>Only existing profiles can be added.</p>
        {(addError || error) && <p className={styles.error} role="alert">{addError || error}</p>}
      </form>
      {invitees.length > 0 && (
        <ul className={styles.usernameList} aria-label="Invited people">
          {invitees.map((invitee) => (
            <li key={invitee.username}>
              <span>{invitee.name} <small>@{invitee.username}</small></span>
              <button
                aria-label={`Remove @${invitee.username}`}
                className={styles.removeButton}
                onClick={() =>
                  onInviteesChange(invitees.filter((entry) => entry.username !== invitee.username))
                }
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
          disabled={invitees.length === 0 || isPending || isAdding}
          onClick={onSend}
          type="button"
        >
          {isPending ? 'Scheduling...' : 'Send invitations'}
        </button>
      </div>
    </section>
  );
};

export default ScheduleInvitesForm;
