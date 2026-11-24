import { Container, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

const AdminPage = async () => {
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container className="py-4">
        <h1>Admin Dashboard</h1>
        <h3 className="mt-4">Registered Users</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </main>
  );
};

export default AdminPage;
