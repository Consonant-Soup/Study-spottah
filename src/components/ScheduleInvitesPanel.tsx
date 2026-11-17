'use client';

import { useState } from 'react';
import styles from './ScheduleInvitesPanel.module.css';

type InvitationStatus = 'pending' | 'accepted' | 'declined';

type Invitation = {
  id: number;
  host: string;
  username: string;
  spot: string;
  date: string;
  time: string;
  groupSize: number;
  status: InvitationStatus;
};

const sampleInvitations: Invitation[] = [
  {
    id: 1,
    host: 'Brian Yao',
    username: '@briyao',
    spot: 'Study spot 2',
    date: 'Thu, Nov 19',
    time: '3:00–5:00 PM',
    groupSize: 3,
    status: 'pending',
  },
  {
    id: 2,
    host: 'Tishya Chhabra',
    username: '@tischh',
    spot: 'Study spot 1',
    date: 'Fri, Nov 20',
    time: '10:00 AM–12:00 PM',
    groupSize: 2,
    status: 'pending',
  },
];

const ScheduleInvitesPanel = () => {
  const [invitations, setInvitations] = useState(sampleInvitations);
  const pendingCount = invitations.filter((invitation) => invitation.status === 'pending').length;

  // Keep responses local to this mockup instead of sending them to a service.
  const updateInvitation = (id: number, status: InvitationStatus) => {
    setInvitations((current) =>
      current.map((invitation) =>
        invitation.id === id ? { ...invitation, status } : invitation,
      ),
    );
  };

  return (
    <section className={styles.panel} aria-labelledby="invitations-title">
      <header className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Your inbox</p>
          <h2 id="invitations-title">Invitations</h2>
        </div>
        <span className={styles.count} aria-label={`${pendingCount} pending invitations`}>
          {pendingCount}
        </span>
      </header>
      <p className={styles.description}>
        Join a group that already has a place and time picked out.
      </p>
      <ul className={styles.invitationList}>
        {invitations.map((invitation) => (
          <li className={styles.invitation} key={invitation.id}>
            <div className={styles.invitationTop}>
              <div className={styles.host}>
                <span className={styles.avatar} aria-hidden="true">
                  {invitation.host.split(' ').map((part) => part[0]).join('')}
                </span>
                <span>
                  <strong>{invitation.host}</strong>
                  <small>{invitation.username}</small>
                </span>
              </div>
              <span className={`${styles.status} ${styles[invitation.status]}`} aria-live="polite">
                {invitation.status === 'pending'
                  ? 'Pending'
                  : invitation.status === 'accepted'
                    ? 'Accepted'
                    : 'Declined'}
              </span>
            </div>
            <p className={styles.spot}>{invitation.spot}</p>
            <p className={styles.details}>
              {invitation.date} <span aria-hidden="true">·</span> {invitation.time}
            </p>
            <p className={styles.groupSize}>
              {invitation.groupSize} {invitation.groupSize === 1 ? 'person' : 'people'} in the group
            </p>
            {invitation.status === 'pending' ? (
              <div className={styles.actions}>
                <button
                  className={styles.acceptButton}
                  onClick={() => updateInvitation(invitation.id, 'accepted')}
                  type="button"
                >
                  Accept
                </button>
                <button
                  className={styles.declineButton}
                  onClick={() => updateInvitation(invitation.id, 'declined')}
                  type="button"
                >
                  Decline
                </button>
              </div>
            ) : (
              <p className={styles.response}>
                {invitation.status === 'accepted'
                  ? 'You’re joining this study group.'
                  : 'This invitation was declined.'}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ScheduleInvitesPanel;
