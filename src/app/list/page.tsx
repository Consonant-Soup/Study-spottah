// import { Col, Container, Row, Table } from 'react-bootstrap';
// import { prisma } from '@/lib/prisma';
// import StuffItem from '@/components/StuffItem';
// import { loggedInProtectedPage } from '@/lib/page-protection';
// import { auth } from '@/lib/auth';
//
// /** Render a list of stuff for the logged in user. */
// const ListPage = async () => {
//   // Protect the page, only logged in users can access it.
//   const session = await auth();
//   loggedInProtectedPage(
//     session as {
//       user: { email: string; id: string; name: string };
//     } | null,
//   );
//   const owner = (session && session.user && session.user.email) || '';
//   const stuff = await prisma.stuff.findMany({
//     where: {
//       owner,
//     },
//   });
//   // console.log(stuff);
//   return (
//     <main>
//       <Container id="list" fluid className="py-3">
//         <Row>
//           <Col>
//             <h1>Stuff</h1>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Quantity</th>
//                   <th>Condition</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {stuff.map((item) => (
//                   <StuffItem key={item.id} {...item} />
//                 ))}
//               </tbody>
//             </Table>
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// };
//
// export default ListPage;

/**
 * app/page.tsx
 * Renders only the spot listing. Swap MOCK_SPOTS for a Postgres query later.
 * Theme is imported here so app/layout.tsx stays untouched.
 */
//import '@/styles/theme.css';
import SpotList from '@/components/SpotsList';
import { MOCK_SPOTS } from '@/components/mock-spots';

export default function HomePage() {
  // TODO: replace with `await getPublishedSpots()` once the database exists.
  return <SpotList spots={MOCK_SPOTS} />;
}
