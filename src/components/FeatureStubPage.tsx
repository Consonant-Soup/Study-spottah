import { Col, Container, Row } from 'react-bootstrap';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

type FeatureStubPageProps = {
  title: string;
  description: string;
  requiresAuth?: boolean;
};

const FeatureStubPage = async ({
  title,
  description,
  requiresAuth = false,
}: FeatureStubPageProps) => {
  if (requiresAuth) {
    const session = await auth();
    loggedInProtectedPage(
      session as {
        user: { email: string; id: string; name: string };
      } | null,
    );
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={9}>
            <p className="text-uppercase text-secondary small fw-semibold mb-2">Study Spottah</p>
            <h1>{title}</h1>
            <p className="lead text-secondary">{description}</p>
            <section className="border rounded-3 bg-light p-4 mt-4" aria-label={`${title} wireframe`}>
              <div className="border rounded-3 bg-white p-4">
                <div className="placeholder-glow mb-4" aria-hidden="true">
                  <span className="placeholder col-5" />
                </div>
                <div className="row g-3" aria-hidden="true">
                  <div className="col-md-7">
                    <div className="placeholder-glow">
                      <span className="placeholder col-12 mb-2" />
                      <span className="placeholder col-9 mb-2" />
                      <span className="placeholder col-7" />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="placeholder-glow">
                      <span className="placeholder col-12 mb-2" />
                      <span className="placeholder col-8" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-secondary mb-0 mt-3 small">
                Wireframe placeholder — this feature is ready for its next design step.
              </p>
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default FeatureStubPage;
