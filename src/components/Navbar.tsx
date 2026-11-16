'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  BoxArrowRight,
  BusFrontFill,
  CalendarWeekFill,
  HouseFill,
  Lock,
  PersonCircle,
  PlusCircleFill,
} from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;

  const currentUser = session?.user?.email;
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/" aria-label="Home">
          <HouseFill className="me-2" aria-hidden="true" />
          Study Spottah
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="study-spottah-navbar" />
        <Navbar.Collapse id="study-spottah-navbar">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link href="/schedule" active={pathName === '/schedule'}>
                  <CalendarWeekFill className="me-1" aria-hidden="true" />
                  Schedule a study session
                </Nav.Link>
              </>
            )}
            <Nav.Link href="/transit" active={pathName === '/transit'}>
              <BusFrontFill className="me-1" aria-hidden="true" />
              Transit
            </Nav.Link>
            {currentUser && (
              <Nav.Link href="/spots/new" active={pathName === '/spots/new'}>
                <PlusCircleFill className="me-1" aria-hidden="true" />
                Create/report a new spot
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <Nav.Link href="/profile" active={pathName === '/profile'}>
                  <PersonCircle className="me-1" aria-hidden="true" />
                  Profile
                </Nav.Link>
                <NavDropdown id="account-dropdown" title={currentUser}>
                  <NavDropdown.Item href="/api/auth/signout">
                    <BoxArrowRight className="me-2" aria-hidden="true" />
                    Sign out
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/auth/change-password">
                    <Lock className="me-2" aria-hidden="true" />
                    Change password
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link id="login-nav" href="/auth/signin" active={pathName === '/auth/signin'}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
