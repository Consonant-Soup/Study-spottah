import { Col, Container, Row } from 'react-bootstrap';
import { Spot } from '@prisma/client';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import SpotCard from '@/components/SpotCard';

/** Render a list of study spots for the logged-in user. */
const ListPage = async () => {
  // Protect the page so only logged-in users can access it
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  // Fetch all spots from the database
  const spots: Spot[] = await prisma.spot.findMany({
    orderBy: {
      id: 'desc', // Shows the newly added spots first
    },
  });

  return (
    <main style={{ backgroundColor: '#F5F7FC', color: '#000000', minHeight: '100vh' }}>      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1 className="text-center mb-4">Study Spots</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
              {spots.map((spot) => (
                <Col key={spot.id}>
                  <SpotCard spot={spot} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
