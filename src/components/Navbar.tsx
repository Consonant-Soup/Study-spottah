'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import styles from './Navbar.module.css';
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
  // Keep public links visible while Auth.js checks the session.
  const authenticated = status === 'authenticated' && Boolean(session?.user?.email);

  const currentUser = authenticated ? session?.user?.email : null;
  return (
    <Navbar expand="lg" className={styles.studyNavbar} aria-label="Study Spottah main navigation">
      <Container>
        <Navbar.Brand href="/" aria-label="Study Spottah home">
          <HouseFill className="me-2" aria-hidden="true" />
          Study Spottah
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="study-spottah-navbar" className={styles.toggle} />
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
          <Nav className={styles.accountMenu}>
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
            ) : status === 'unauthenticated' ? (
              <Nav.Link id="login-nav" href="/auth/signin" active={pathName === '/auth/signin'}>
                Login
              </Nav.Link>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
