import { Col, Container, Row } from 'react-bootstrap';
import SpotsPanel from '@/components/SpotsPanel';
import styles from './page.module.css';

const Home = () => (
  <main className={styles.page}>
    <Container className="py-5">
      <Row className="align-items-center gy-5">
        <Col lg={6}>
          <p className={styles.eyebrow}>Find your next study spot</p>
          <h1 className={styles.heading}>A better place to focus is closer than you think.</h1>
          <p className={styles.intro}>
            Discover welcoming places to study, plan a session with friends, and find your way there.
          </p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="/transit">Explore transit</a>
            <a className={styles.secondaryButton} href="/schedule">Schedule a study session</a>
          </div>
        </Col>
        <Col lg={6}>
          <SpotsPanel />
        </Col>
      </Row>

      <section className={styles.featureSection}>
        <p className={styles.eyebrow}>Make room for good work</p>
        <h2 className={styles.sectionHeading}>Your study day, made simpler.</h2>
        <Row className="g-3 mt-2">
          <Col md={4}>
            <article className={styles.featureCard}>
              <span className={styles.featureNumber}>01</span>
              <h3>Find a spot</h3>
              <p>Browse study-friendly places and choose the right setting for your day.</p>
            </article>
          </Col>
          <Col md={4}>
            <article className={styles.featureCard}>
              <span className={styles.featureNumber}>02</span>
              <h3>Get there easily</h3>
              <p>Check transit options and make the trip part of your plan.</p>
            </article>
          </Col>
          <Col md={4}>
            <article className={styles.featureCard}>
              <span className={styles.featureNumber}>03</span>
              <h3>Study together</h3>
              <p>Schedule a session and invite your friends to join you.</p>
            </article>
          </Col>
        </Row>
      </section>
    </Container>
  </main>
);

export default Home;
