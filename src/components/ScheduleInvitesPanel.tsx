'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cancelScheduledMeeting, respondToMeeting } from '@/app/schedule/actions';
import styles from './ScheduleInvitesPanel.module.css';

export type ScheduleMeeting = {
  id: number;
  spotLocation: string;
  startAt: string;
  endAt: string;
  timeZone: string;
  status: 'scheduled' | 'cancelled';
  response: 'pending' | 'accepted' | 'declined';
  otherParticipants: {
    response: 'pending' | 'accepted' | 'declined';
    name: string;
    username: string | null;
  }[];
  isConvener: boolean;
};

type ScheduleInvitesPanelProps = {
  meetings: ScheduleMeeting[];
};

const formatMeetingDate = (date: string, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(new Date(date));

const formatMeetingTime = (startAt: string, endAt: string, timeZone: string) => {
  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZone };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return `${formatter.format(new Date(startAt))}–${formatter.format(new Date(endAt))}`;
};

const ScheduleInvitesPanel = ({ meetings }: ScheduleInvitesPanelProps) => {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pendingCount = meetings.filter(
    (meeting) => !meeting.isConvener && meeting.response === 'pending' && meeting.status === 'scheduled',
  ).length;

  const runAction = (action: () => Promise<{ error?: string }>) => {
    setError('');
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <section className={styles.panel} aria-labelledby="invitations-title">
      <header className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Your schedule</p>
          <h2 id="invitations-title">Meetings &amp; invitations</h2>
        </div>
        <span className={styles.count} aria-label={`${pendingCount} pending invitations`}>
          {pendingCount}
        </span>
      </header>
      <p className={styles.description}>
        Respond to invitations or manage meetings you have convened.
      </p>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {meetings.length === 0 ? (
        <p className={styles.description}>You do not have any meetings yet.</p>
      ) : (
        <ul className={styles.invitationList}>
          {meetings.map((meeting) => (
            <li className={styles.invitation} key={meeting.id}>
              <div className={styles.invitationTop}>
                <div className={styles.host}>
                  <span className={styles.avatar} aria-hidden="true">
                    {meeting.isConvener ? 'You' : 'Group'}
                  </span>
                  <strong>
                    {meeting.isConvener
                      ? `You invited ${meeting.otherParticipants.length} ${meeting.otherParticipants.length === 1 ? 'person' : 'people'}`
                      : 'Study group meeting'}
                  </strong>
                </div>
                <span className={`${styles.status} ${styles[meeting.status === 'cancelled' ? 'declined' : meeting.response]}`}>
                  {meeting.status === 'cancelled'
                    ? 'Cancelled'
                    : meeting.response[0].toUpperCase() + meeting.response.slice(1)}
                </span>
              </div>
              <p className={styles.spot}>{meeting.spotLocation}</p>
              <p className={styles.details}>
                {formatMeetingDate(meeting.startAt, meeting.timeZone)} ·{' '}
                {formatMeetingTime(meeting.startAt, meeting.endAt, meeting.timeZone)}
              </p>
              <ul className={styles.participantList} aria-label="Meeting participants">
                <li>
                  You
                  <span className={`${styles.status} ${styles[meeting.response]}`}>
                    {meeting.response[0].toUpperCase() + meeting.response.slice(1)}
                  </span>
                </li>
                {meeting.otherParticipants.map((participant) => (
                  <li key={`${participant.username ?? participant.name}-${participant.name}`}>
                    <span>
                      {participant.name}
                      {participant.username && <small> @{participant.username}</small>}
                    </span>
                    <span className={`${styles.status} ${styles[participant.response]}`}>
                      {participant.response[0].toUpperCase() + participant.response.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
              {meeting.status === 'scheduled' && !meeting.isConvener && meeting.response === 'pending' && (
                <div className={styles.actions}>
                  <button
                    className={styles.acceptButton}
                    disabled={isPending}
                    onClick={() => runAction(() => respondToMeeting(meeting.id, 'accepted'))}
                    type="button"
                  >
                    Accept
                  </button>
                  <button
                    className={styles.declineButton}
                    disabled={isPending}
                    onClick={() => runAction(() => respondToMeeting(meeting.id, 'declined'))}
                    type="button"
                  >
                    Decline
                  </button>
                </div>
              )}
              {meeting.status === 'scheduled' && meeting.isConvener && (
                <div className={styles.actions}>
                  <button
                    className={styles.declineButton}
                    disabled={isPending}
                    onClick={() => runAction(() => cancelScheduledMeeting(meeting.id))}
                    type="button"
                  >
                    Cancel meeting
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ScheduleInvitesPanel;
