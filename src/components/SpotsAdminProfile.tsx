'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, Col, Container, Form, Image, ListGroup, Modal, Row } from 'react-bootstrap';
import { Profile, Spot } from '@prisma/client';
import { signOut } from 'next-auth/react';
import swal from 'sweetalert';
import { deleteSpot, updateEmail, updateProfilePic, updateUsername } from '@/lib/dbActions';
import styles from './SpotsProfile.module.css';

interface AdminProfileViewProps {
  profile: Profile;
  totalUsers?: number;
  totalProfiles?: number;
  spots?: Spot[];
}

type ActiveModal = 'email' | 'profilepic' | null;

const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  profile,
  totalUsers = 0,
  totalProfiles = 0,
  spots = [],
}) => {
  const initialUsername = profile.username || profile.uhemail.split('@')[0];
  const [username, setUsername] = useState(initialUsername);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(initialUsername);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [emailInput, setEmailInput] = useState(profile.uhemail);
  const [picInput, setPicInput] = useState(profile.profilepic || '');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUsernameSave = async () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) return;
    try {
      await updateUsername(profile.uhemail, trimmed);
      setUsername(trimmed);
      setEditingUsername(false);
      swal('Success', `Username changed to "@${trimmed}".`, 'success');
    } catch {
      swal('Error', 'That username is already taken or invalid.', 'error');
    }
  };

  const handleUsernameCancel = () => {
    setUsernameInput(username);
    setEditingUsername(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || emailInput === profile.uhemail) return;
    setSaving(true);
    try {
      await updateEmail(profile.uhemail, emailInput.trim());
      setActiveModal(null);
      await swal('Email Updated', 'Please sign in again with your new email.', 'success');
      await signOut({ callbackUrl: '/auth/signin' });
    } catch {
      swal('Error', 'Could not update email. It may already be in use.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfilePic(profile.uhemail, picInput.trim());
      setActiveModal(null);
      swal('Success', 'Profile picture updated!', 'success');
    } catch {
      swal('Error', 'Could not update profile picture.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpot = async (spotId: number, spotLabel: string) => {
    const confirmed = await swal({
      title: 'Delete Spot?',
      text: `Are you sure you want to permanently delete "${spotLabel}"?`,
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

    if (!confirmed) return;

    setDeletingId(spotId);
    try {
      await deleteSpot(spotId);
      swal('Deleted', `"${spotLabel}" has been removed.`, 'success');
    } catch {
      swal('Error', 'Could not delete spot.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <span className={styles.eyebrow}>ADMIN PROFILE</span>

            {/* Top Card: Admin Profile */}
            <Card className={`rounded-0 ${styles.card}`}>
              <Card.Header as="h4" className={`rounded-0 ${styles.header}`}>
                Administrator Profile
              </Card.Header>

              <Card.Body>
                <Row className="align-items-center mb-2">
                  <Col xs="auto">
                    <Image
                      src={profile.profilepic || '/default-avatar.png'}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      width={96}
                      height={96}
                      className={`rounded-0 ${styles.avatar}`}
                    />
                  </Col>
                  <Col>
                    <h3 className={styles.name}>
                      {profile.firstName}
                      {' '}
                      {profile.lastName}
                    </h3>
                    <div className={styles.usernameDisplay}>
                      @
                      {username}
                    </div>
                    <p className="mb-2">{profile.uhemail}</p>
                    <Badge bg="danger" className="rounded-0 text-uppercase me-2">
                      ADMIN
                    </Badge>
                    <Badge className="rounded-0 text-uppercase badge-theme-major">
                      {profile.standing}
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
                  <strong>Major:</strong>
                  {' '}
                  {profile.major}
                </ListGroup.Item>
                <ListGroup.Item className={styles.listItem}>
                  <strong>Role:</strong>
                  {' '}
                  Administrator
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Admin Controls Card */}
            <Card className={`rounded-0 ${styles.card} mt-4`}>
              <Card.Header className={`rounded-0 ${styles.settingsHeader}`}>
                Admin Controls
              </Card.Header>
              <ListGroup variant="flush" className="rounded-0">
                <ListGroup.Item className={styles.listItem}>
                  <strong>Registered Accounts:</strong>
                  {' '}
                  {totalUsers}
                  {' '}
                  |
                  {' '}
                  <strong>Completed Profiles:</strong>
                  {' '}
                  {totalProfiles}
                  {' '}
                  |
                  {' '}
                  <strong>Total Spots:</strong>
                  {' '}
                  {spots.length}
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Link
                    href="/admin"
                    className={`btn rounded-0 w-75 ${styles.settingsBtn}`}
                  >
                    open admin dashboard
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Manage / Delete Spots Card */}
            <Card className={`rounded-0 ${styles.card} mt-4`}>
              <Card.Header className={`rounded-0 ${styles.settingsHeader}`}>
                Manage Spots
              </Card.Header>
              <ListGroup variant="flush" className="rounded-0">
                {spots.length === 0 ? (
                  <ListGroup.Item className={styles.listItem}>
                    No spots available to manage.
                  </ListGroup.Item>
                ) : (
                  spots.map((spot) => {
                    // Adjust spot.name / spot.location if your Spot model uses different field names
                    const spotLabel = (spot as { name?: string; location?: string }).name
                      || (spot as { location?: string }).location
                      || `Spot #${spot.id}`;

                    return (
                      <ListGroup.Item
                        key={spot.id}
                        className={`${styles.listItem} d-flex justify-content-between align-items-center`}
                      >
                        <div>
                          <strong>{spotLabel}</strong>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deletingId === spot.id}
                          className="rounded-0"
                          onClick={() => handleDeleteSpot(spot.id, spotLabel)}
                        >                   
                        </Button>
                        {deletingId === spot.id ? 'Deleting...' : 'Delete'}

                    </ListGroup.Item>
                    );
                    })
                )}
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
                    onClick={() => setActiveModal('email')}
                  >
                    change email
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Link
                    href="/auth/change-password"
                    className={`btn rounded-0 w-75 ${styles.settingsBtn}`}
                  >
                    change password
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item className="text-center bg-transparent py-3">
                  <Button
                    className={`rounded-0 w-75 ${styles.settingsBtn}`}
                    onClick={() => setActiveModal('profilepic')}
                  >
                    add a profile picture
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Bottom Card: Settings */}
            {/* Change Email Modal */}
                  <Modal show={activeModal === 'email'} onHide={() => setActiveModal(null)} centered>
                    <Modal.Header closeButton className="rounded-0">
                      <Modal.Title>Change Email</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleEmailSubmit}>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label>New Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="rounded-0"
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer className="rounded-0">
                        <Button variant="secondary" onClick={() => setActiveModal(null)} className="rounded-0">
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving} className="rounded-0">
                          {saving ? 'Saving...' : 'Save Email'}
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal>

             {/* Add / Update Profile Picture Modal */}
                  <Modal show={activeModal === 'profilepic'} onHide={() => setActiveModal(null)} centered>
                    <Modal.Header closeButton className="rounded-0">
                      <Modal.Title>Profile Picture</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handlePicSubmit}>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label>Image URL</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://example.com"
                            value={picInput}
                            onChange={(e) => setPicInput(e.target.value)}
                            className="rounded-0"
                          />
                          <Form.Text className="text-muted">
                            Leave blank and save to reset to the default avatar.
                          </Form.Text>
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer className="rounded-0">
                        <Button variant="secondary" onClick={() => setActiveModal(null)} className="rounded-0">
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving} className="rounded-0">
                          {saving ? 'Saving...' : 'Save Picture'}
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal>
            </Col>
        </Row>
    </Container>
    </div>
)};

export default AdminProfileView;
