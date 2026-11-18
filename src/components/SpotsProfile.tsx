'use client';

import React from 'react';
import { Badge, Button, Card, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import swal from 'sweetalert';

const MOCK_PROFILE = {
  profilepic: '',
  uhemail: 'john@hawaii.edu',
  uhstudentid: 12345,
  firstName: 'John',
  lastName: 'Doe',
  major: 'Engineering',
  standing: 'senior',
};

const ProfileMockup: React.FC = () => {
  const handleMockAction = (actionName: string) => {
    swal(actionName, 'This is a UI mockup. No database changes were made.', 'info');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            {/* Top Card: Student Profile */}
            <Card className="rounded-0 theme-card" style={{ backgroundColor: '#ffffff' }}>
              <Card.Header as="h4" className="rounded-0 theme-header fw-bold">
                Student Profile
              </Card.Header>

              <Card.Body style={{ color: '#000000' }}>
                <Row className="align-items-center mb-2">
                  <Col xs="auto">
                    <Image
                      src={MOCK_PROFILE.profilepic || '/default-avatar.png'}
                      alt={`${MOCK_PROFILE.firstName} ${MOCK_PROFILE.lastName}`}
                      width={96}
                      height={96}
                      className="rounded-0 object-fit-cover"
                      style={{ border: '2px solid #000000' }}
                    />
                  </Col>
                  <Col>
                    <h3 className="fw-bold mb-1">
                      {MOCK_PROFILE.firstName} {MOCK_PROFILE.lastName}
                    </h3>
                    <p className="mb-2">{MOCK_PROFILE.uhemail}</p>
                    <Badge className="rounded-0 text-uppercase badge-theme-major">
                      {MOCK_PROFILE.standing}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>

              <ListGroup variant="flush" className="rounded-0">
                <ListGroup.Item className="bg-transparent">
                  <strong>UH Student ID:</strong> {MOCK_PROFILE.uhstudentid}
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent">
                  <strong>Major:</strong> {MOCK_PROFILE.major}
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Bottom Card: Settings */}
            <Card className="rounded-0 theme-card mt-4" style={{ backgroundColor: '#ffffff' }}>
              <Card.Header className="rounded-0 theme-header text-center">
                <h2 className="mb-0 fw-bold">Settings</h2>
              </Card.Header>

              <ListGroup variant="flush" className="rounded-0">
                <ListGroup.Item className="text-center bg-transparent">
                  <Button
                    className="btn-theme rounded-0 w-75"
                    onClick={() => handleMockAction('Change Email')}
                  >
                    change email
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent">
                  <Button
                    className="btn-theme rounded-0 w-75"
                    onClick={() => handleMockAction('Change Username')}
                  >
                    change username
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent">
                  <Button
                    className="btn-theme rounded-0 w-75"
                    onClick={() => handleMockAction('Change Password')}
                  >
                    change password
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent">
                  <Button
                    className="btn-theme rounded-0 w-75"
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