'use client';

import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import styles from './AddSpotForm.module.css';

const MAJORS = ['Engineering', 'Bio', 'Math'] as const;

const YES_NO_FIELDS = [
  { name: 'outdoors', label: 'Outdoors' },
  { name: 'ac', label: 'AC' },
  { name: 'microwave', label: 'Microwave' },
  { name: 'outlets', label: 'Outlets' },
  { name: 'windows', label: 'Windows' },
  { name: 'groupstudy', label: 'Group Study' },
  { name: 'tutors', label: 'Tutors' },
  { name: 'printer', label: 'Printer' },
  { name: 'foodAllowed', label: 'Food Allowed' },
  { name: 'seating', label: 'Seating' },
  { name: 'computers', label: 'Computers' },
] as const;

const AddSpotForm: React.FC = () => {
  const [showOtherMajor, setShowOtherMajor] = useState(false);

  const handleMockSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    swal('Mockup Submitted', 'This is a UI preview. No data was sent to the database.', 'info');
  };

  return (
    <div className={styles.page}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Col className="mb-3">
              <span className={styles.eyebrow}>CONTRIBUTE</span>
              <h2 className={styles.heading}>
                Add a Spot
              </h2>
            </Col>

            <Card className={`rounded-0 ${styles.card}`}>
              <Card.Header className={`rounded-0 ${styles.header}`}>
                New Study Spot Details
              </Card.Header>

              <Card.Body>
                <Form onSubmit={handleMockSubmit}>
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Name</Form.Label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Hamilton Quiet Zone"
                      className="form-control rounded-0"
                    />
                  </Form.Group>

                  {/* Location */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Location</Form.Label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g., Hamilton Library 3rd Floor"
                      className="form-control rounded-0"
                    />
                  </Form.Group>

                  {/* Noise Level */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Noise Level (1 = Silent, 7 = Very Loud)
                    </Form.Label>
                    <Form.Select name="noiselvl" defaultValue={1} className="rounded-0">
                      <option value={1}>1 - Silent (Library Quiet Zone)</option>
                      <option value={2}>2 - Very Quiet</option>
                      <option value={3}>3 - Low Whisper</option>
                      <option value={4}>4 - Moderate Background</option>
                      <option value={5}>5 - Conversational</option>
                      <option value={6}>6 - Lively / Group Study</option>
                      <option value={7}>7 - Loud / High Traffic</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Majors */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Majors</Form.Label>
                    <div>
                      {MAJORS.map((major) => (
                        <div className="form-check form-check-inline" key={major}>
                          <input
                            className="form-check-input rounded-0"
                            type="checkbox"
                            id={`major-${major}`}
                            name="majors"
                            value={major}
                          />
                          <label className="form-check-label" htmlFor={`major-${major}`}>
                            {major}
                          </label>
                        </div>
                      ))}
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input rounded-0"
                          type="checkbox"
                          id="major-other"
                          checked={showOtherMajor}
                          onChange={(e) => setShowOtherMajor(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="major-other">
                          Other
                        </label>
                      </div>
                    </div>
                    {showOtherMajor && (
                      <input
                        type="text"
                        name="otherMajor"
                        placeholder="Type your major"
                        className="form-control rounded-0 mt-2"
                      />
                    )}
                  </Form.Group>

                  {/* Yes / No / Unknown Fields */}
                  <Row>
                    {YES_NO_FIELDS.map((field) => (
                      <Col xs={12} sm={6} key={field.name}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">{field.label}</Form.Label>
                          <select
                            name={field.name}
                            defaultValue="unknown"
                            className="form-select rounded-0"
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  {/* Submit & Reset Buttons */}
                  <Form.Group className="form-group">
                    <Row className="pt-3">
                      <Col>
                        <Button type="submit" className={`rounded-0 w-100 ${styles.submitBtn}`}>
                          Submit
                        </Button>
                      </Col>
                      <Col>
                        <Button type="reset" className={`rounded-0 w-100 ${styles.resetBtn}`}>
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddSpotForm;
