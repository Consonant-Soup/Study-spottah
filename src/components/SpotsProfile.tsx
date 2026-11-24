'use client';

import React, { useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Image, ListGroup, Modal, Row } from 'react-bootstrap';
import { Profile } from '@prisma/client';
import { signOut } from 'next-auth/react';
import swal from 'sweetalert';
import { updateEmail, updatePassword, updateProfilePic, updateUsername } from '@/lib/dbActions';
import styles from './SpotsProfile.module.css';
import Link from 'next/link';

interface ProfileViewProps {
  profile: Profile;
}

type ActiveModal = 'email' | 'password' | 'profilepic' | null;

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  const initialUsername = profile.username || profile.uhemail.split('@')[0];
  const [username, setUsername] = useState(initialUsername);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(initialUsername);

  // Modal state for Email, Password, and Profile Picture
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [emailInput, setEmailInput] = useState(profile.uhemail);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [picInput, setPicInput] = useState(profile.profilepic || '');
  const [saving, setSaving] = useState(false);

  // 1. Save Username
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

  // 2. Save Email
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

  // 3. Save Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 6) {
      swal('Error', 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      swal('Error', 'Passwords do not match.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updatePassword(profile.uhemail, passwordInput);
      setActiveModal(null);
      setPasswordInput('');
      setConfirmPasswordInput('');
      await swal('Password Updated', 'Please sign in again with your new password.', 'success');
      await signOut({ callbackUrl: '/auth/signin' });
    } catch {
      swal('Error', 'Could not update password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 4. Save Profile Picture
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
          </Col>
        </Row>
      </Container>

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

      {/* Change Password Modal */}
      <Modal show={activeModal === 'password'} onHide={() => setActiveModal(null)} centered>
        <Modal.Header closeButton className="rounded-0">
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={6}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={6}
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                className="rounded-0"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="rounded-0">
            <Button variant="secondary" onClick={() => setActiveModal(null)} className="rounded-0">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="rounded-0">
              {saving ? 'Saving...' : 'Save Password'}
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
  </div>
);
};

export default ProfileView;