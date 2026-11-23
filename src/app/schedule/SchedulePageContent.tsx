'use client';

import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import SpotsSection from '@/components/spots/SpotsSection';
import ScheduleInvitesPanel from '@/components/ScheduleInvitesPanel';
import styles from './page.module.css';

const SchedulePageContent = () => {
  const router = useRouter();

  // Keep the spot name in the URL so the mock scheduling flow can be opened directly.
  const handleSpotSelect = (spotName: string) => {
    router.push(`/schedule/calendar?spot=${encodeURIComponent(spotName)}`);
  };

  return (
    <main className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={12}>
            <p className={styles.eyebrow}>Study groups</p>
            <h1 className={styles.heading}>Plan or join a study session</h1>
            <p className={styles.intro}>
              Start a group at a spot you choose, or accept an invitation to join someone else.
            </p>
          </Col>
        </Row>
        <Row className="g-4 align-items-start">
          <Col lg={7}>
            <section aria-labelledby="plan-session-title">
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Start a group</p>
                  <h2 id="plan-session-title">Choose a study spot</h2>
                </div>
                {/* <span className={styles.sectionNumber}>01</span> */}
              </div>
              <p className={styles.sectionIntro}>
                Browse the map or switch to the list to pick a place and time.
              </p>
              <SpotsSection onSpotSelect={handleSpotSelect} />
            </section>
          </Col>
          <Col lg={5}>
            <ScheduleInvitesPanel />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SchedulePageContent;
