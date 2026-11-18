'use client';

import React, { useState } from 'react';
import { Badge, Button, Card, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import styles from './SpotsProfile.module.css';

const MOCK_PROFILE = {
  profilepic: '',
  uhemail: 'john@hawaii.edu',
  uhstudentid: 12345,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  major: 'Engineering',
  standing: 'senior',
};

const ProfileMockup: React.FC = () => {
  const [username, setUsername] = useState(MOCK_PROFILE.username);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);

  const handleMockAction = (actionName: string) => {
    swal(actionName, 'This is a UI mockup. No database changes were made.', 'info');
  };

  const handleUsernameSave = () => {
    if (usernameInput.trim()) {
      setUsername(usernameInput.trim());
      setEditingUsername(false);
      swal('Username Updated', `Username changed to "${usernameInput.trim()}" (mockup only).`, 'success');
    }
  };

  const handleUsernameCancel = () => {
    setUsernameInput(username);
    setEditingUsername(false);
  };

  return (
    <div className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <span className={styles.eyebrow}>YOUR PROFILE</span>

            {/* Top Card: Student Profile */}
            <Card className={`rounded-0 ${styles.card}`}>
              <Card.Header as="h4" className={`rounded-0 ${styles.header}`}>
                Student Profile
              </Card.Header>

              <Card.Body>
                <Row className="align-items-center mb-2">
                  <Col xs="auto">
                    <Image
                      src={MOCK_PROFILE.profilepic || '/default-avatar.png'}
                      alt={`${MOCK_PROFILE.firstName} ${MOCK_PROFILE.lastName}`}
                      width={96}
                      height={96}
                      className={`rounded-0 ${styles.avatar}`}
                    />
                  </Col>
                  <Col>
                    <h3 className={styles.name}>
                      {MOCK_PROFILE.firstName}
                      {' '}
                      {MOCK_PROFILE.lastName}
                    </h3>
                    <div className={styles.usernameDisplay}>
                      @
                      {username}
                    </div>
                    <p className="mb-2">{MOCK_PROFILE.uhemail}</p>
                    <Badge className="rounded-0 text-uppercase badge-theme-major">
                      {MOCK_PROFILE.standing}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>

              <ListGroup variant="flush" className="rounded-0">
                <ListGroup.Item className={styles.listItem}>
                  <strong>Username:</strong>
                  {' '}
                  {editingUsername ? (
                    <div className={styles.usernameForm}>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className={`form-control rounded-0 ${styles.usernameInput}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleUsernameSave()}
                      />
                      <Button className={`rounded-0 ${styles.usernameSave}`} onClick={handleUsernameSave}>
                        Save
                      </Button>
                      <Button className={`rounded-0 ${styles.usernameCancel}`} onClick={handleUsernameCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span>
                      {username}
                      {' '}
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 ms-2"
                        style={{ color: '#000', fontWeight: 700, fontSize: '11px', textDecoration: 'underline' }}
                        onClick={() => setEditingUsername(true)}
                      >
                        edit
                      </Button>
                    </span>
                  )}
                </ListGroup.Item>
                <ListGroup.Item className={styles.listItem}>
                  <strong>UH Student ID:</strong>
                  {' '}
                  {MOCK_PROFILE.uhstudentid}
                </ListGroup.Item>
                <ListGroup.Item className={styles.listItem}>
                  <strong>Major:</strong>
                  {' '}
                  {MOCK_PROFILE.major}
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Bottom Card: Settings */}
            <Card className={`rounded-0 ${styles.card} mt-4`}>
              <Card.Header className={`rounded-0 ${styles.settingsHeader}`}>
                Settings
              </Card.Header>

              <ListGroup variant="flush" className="rounded-0">
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Button
                    className={`rounded-0 w-75 ${styles.settingsBtn}`}
                    onClick={() => setEditingUsername(true)}
                  >
                    change username
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Button
                    className={`rounded-0 w-75 ${styles.settingsBtn}`}
                    onClick={() => handleMockAction('Change Email')}
                  >
                    change email
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Button
                    className={`rounded-0 w-75 ${styles.settingsBtn}`}
                    onClick={() => handleMockAction('Change Password')}
                  >
                    change password
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Button
                    className={`rounded-0 w-75 ${styles.settingsBtn}`}
                    onClick={() => handleMockAction('Add a Profile Picture')}
                  >
                    add a profile picture
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileMockup;
