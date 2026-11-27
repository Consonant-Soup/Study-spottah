'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import SpotsSection from '@/components/spots/SpotsSection';
import type { ScheduleMeeting } from '@/components/ScheduleInvitesPanel';
import ScheduleInvitesPanel from '@/components/ScheduleInvitesPanel';
import styles from './page.module.css';

type SchedulePageContentProps = {
  spots: { id: number; location: string }[];
  meetings: ScheduleMeeting[];
};

const SchedulePageContent = ({ spots, meetings }: SchedulePageContentProps) => {
  const router = useRouter();
  const [spotError, setSpotError] = useState('');

  const handleSpotSelect = (spotName: string) => {
    const spot = spots.find((entry) => entry.location === spotName);
    if (!spot) {
      setSpotError('This spot is not in the database yet. Choose another spot.');
      return;
    }

    setSpotError('');
    router.push(`/schedule/calendar?spot=${spot.id}`);
  };

  return (
    <main className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={12}>
            <p className={styles.eyebrow}>Study groups</p>
            <h1 className={styles.heading}>Plan or join a study session</h1>
            <p className={styles.intro}>
              Choose a study spot, schedule a time, and invite your group.
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
                Switch to list view to choose a spot, then select a date, time, and attendees.
              </p>
              {spotError && <p className={styles.sectionIntro} role="alert">{spotError}</p>}
              <SpotsSection onSpotSelect={handleSpotSelect} />
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
