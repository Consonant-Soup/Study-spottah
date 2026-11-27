'use client';

import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import type { ScheduleMeeting } from '@/components/ScheduleInvitesPanel';
import ScheduleInvitesPanel from '@/components/ScheduleInvitesPanel';
import styles from './page.module.css';

type SchedulePageContentProps = {
  spots: { id: number; location: string }[];
  meetings: ScheduleMeeting[];
};

const SchedulePageContent = ({ spots, meetings }: SchedulePageContentProps) => {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={12}>
            <p className={styles.eyebrow}>Study groups</p>
            <h1 className={styles.heading}>Plan or join a study session</h1>
            <p className={styles.intro}>
              Choose a spot and invite one person to meet with you.
            </p>
          </Col>
        </Row>
        <Row className="g-4 align-items-start">
          <Col lg={7}>
            <section aria-labelledby="plan-session-title">
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Start a meeting</p>
                  <h2 id="plan-session-title">Choose a study spot</h2>
                </div>
              </div>
              <p className={styles.sectionIntro}>
                Select a spot from the database, then choose a date, time, and invitee.
              </p>
              {spots.length === 0 ? (
                <p>No study spots are available yet.</p>
              ) : (
                <ul className={styles.databaseSpotList}>
                  {spots.map((spot) => (
                    <li key={spot.id}>
                      <span>{spot.location}</span>
                      <button
                        className={styles.chooseSpotButton}
                        onClick={() => router.push(`/schedule/calendar?spot=${spot.id}`)}
                        type="button"
                      >
                        Choose spot
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Col>
          <Col lg={5}>
            <ScheduleInvitesPanel meetings={meetings} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SchedulePageContent;
