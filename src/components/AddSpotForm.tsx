'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { addSpots } from '@/lib/dbActions';
import styles from './AddSpotForm.module.css';

const COVERAGE_OPTIONS = [
  { value: 'INDOOR', label: 'Indoor' },
  { value: 'OUTDOOR', label: 'Outdoor' },
  { value: 'OUTDOOR_COVERED', label: 'Outdoor with Coverage' },
] as const;

const REQUIRED_AMENITIES = [
  { name: 'outlets', label: 'Has Outlets?' },
  { name: 'foodAllowed', label: 'Allows Food/Drink?' },
  { name: 'microwave', label: 'Has a Microwave?' },
  { name: 'groupstudy', label: 'Is Group Study Allowed?' },
] as const;

const OPTIONAL_AMENITIES = [
  { name: 'ac', label: 'Has AC?' },
  { name: 'printer', label: 'Has Printer?' },
  { name: 'computers', label: 'Has Computer Access?' },
  { name: 'whiteboard', label: 'Has White Board?' },
  { name: 'projector', label: 'Has Projector w/ HDMI?' },
  { name: 'chalkboard', label: 'Has Chalk Board?' },
  { name: 'windows', label: 'Has Windows?' },
  { name: 'tutors', label: 'Has TAs?' },
  { name: 'freePaper', label: 'Has Free Paper?' },
  { name: 'largeFormatPrinter', label: 'Has Large Format Printer?' },
] as const;

const ADJACENCY_FIELDS = [
  { name: 'nearBathroom', label: 'Near the Bathroom?' },
  { name: 'nearWaterFountain', label: 'Near a Water Fountain?' },
  { name: 'nearVendingMachine', label: 'Near a Vending Machine?' },
  { name: 'nearFoodStore', label: 'Near Food Store?' },
  { name: 'nearBusStop', label: 'Near TheBus Stop?' },
  { name: 'nearShuttle', label: 'Near the Rainbow Shuttle?' },
] as const;

const AddSpotForm: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get('name') as string;
    if (!name?.trim()) {
      swal('Missing Info', 'Spot name is required.', 'warning');
      return;
    }

    const coverage = data.get('coverage') as string;
    if (!coverage) {
      swal('Missing Info', 'Coverage type is required.', 'warning');
      return;
    }

    const getField = (key: string) => (data.get(key) as string) || 'unknown';

    const latStr = (data.get('lat') as string)?.trim();
    const lngStr = (data.get('lng') as string)?.trim();

    await addSpots({
      name: name.trim(),
      description: (data.get('description') as string)?.trim() || undefined,
      location: (data.get('location') as string)?.trim() || undefined,
      lat: latStr ? parseFloat(latStr) : undefined,
      lng: lngStr ? parseFloat(lngStr) : undefined,
      coverage,
      outlets: getField('outlets'),
      foodAllowed: getField('foodAllowed'),
      microwave: getField('microwave'),
      groupstudy: getField('groupstudy'),
      ac: getField('ac'),
      printer: getField('printer'),
      computers: getField('computers'),
      whiteboard: getField('whiteboard'),
      projector: getField('projector'),
      chalkboard: getField('chalkboard'),
      windows: getField('windows'),
      tutors: getField('tutors'),
      freePaper: getField('freePaper'),
      largeFormatPrinter: getField('largeFormatPrinter'),
      nearBathroom: getField('nearBathroom'),
      nearWaterFountain: getField('nearWaterFountain'),
      nearVendingMachine: getField('nearVendingMachine'),
      nearFoodStore: getField('nearFoodStore'),
      nearBusStop: getField('nearBusStop'),
      nearShuttle: getField('nearShuttle'),
      noiselvl: Number(data.get('noiselvl')) || 1,
      imageUrl: (data.get('imageUrl') as string)?.trim() || undefined,
      comments: (data.get('comments') as string)?.trim() || undefined,
    });
  };

  return (
    <div className={styles.page}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Col className="mb-3">
              <span className={styles.eyebrow}>CONTRIBUTE</span>
              <h2 className={styles.heading}>Add a Spot</h2>
            </Col>

            <Card className={`rounded-0 ${styles.card}`}>
              <Card.Header className={`rounded-0 ${styles.header}`}>
                New Study Spot Details
              </Card.Header>

              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {/* Name (required) */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Spot Name *</Form.Label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Hamilton Quiet Zone"
                      className="form-control rounded-0"
                      required
                    />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Description</Form.Label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="e.g., Quiet upper floor with individual carrels and natural light."
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

                  {/* Coordinates */}
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Latitude</Form.Label>
                        <input
                          type="number"
                          step="any"
                          name="lat"
                          placeholder="e.g., 21.2990"
                          className="form-control rounded-0"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Longitude</Form.Label>
                        <input
                          type="number"
                          step="any"
                          name="lng"
                          placeholder="e.g., -157.8175"
                          className="form-control rounded-0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Coverage (required) */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Coverage *</Form.Label>
                    <Form.Select name="coverage" className="rounded-0" required>
                      <option value="">Select coverage type...</option>
                      {COVERAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Required Amenities */}
                  <h6 className="fw-bold mt-4 mb-3">Required Amenities</h6>
                  <Row>
                    {REQUIRED_AMENITIES.map((field) => (
                      <Col xs={12} sm={6} key={field.name}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">{field.label}</Form.Label>
                          <select name={field.name} defaultValue="unknown" className="form-select rounded-0">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  {/* Optional Amenities */}
                  <h6 className="fw-bold mt-4 mb-3">Optional Amenities</h6>
                  <Row>
                    {OPTIONAL_AMENITIES.map((field) => (
                      <Col xs={12} sm={6} key={field.name}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">{field.label}</Form.Label>
                          <select name={field.name} defaultValue="unknown" className="form-select rounded-0">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  {/* Adjacency */}
                  <h6 className="fw-bold mt-4 mb-3">Nearby</h6>
                  <Row>
                    {ADJACENCY_FIELDS.map((field) => (
                      <Col xs={12} sm={6} key={field.name}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">{field.label}</Form.Label>
                          <select name={field.name} defaultValue="unknown" className="form-select rounded-0">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  {/* Noise Level */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Noise Level *</Form.Label>
                    <Form.Select name="noiselvl" defaultValue={1} className="rounded-0">
                      <option value={1}>1 - Whisper (leaves rustling, AC hum)</option>
                      <option value={2}>2 - Quiet (soft conversation)</option>
                      <option value={3}>3 - Moderate (normal talking)</option>
                      <option value={4}>4 - Loud (busy cafe, group chatter)</option>
                      <option value={5}>5 - Very Loud (construction, lawnmower)</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Image URL */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Image URL</Form.Label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://example.com/photo.jpg"
                      className="form-control rounded-0"
                    />
                  </Form.Group>

                  {/* Comments */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Comments / Notes</Form.Label>
                    <textarea
                      name="comments"
                      rows={3}
                      placeholder="Any additional notes about this spot..."
                      className="form-control rounded-0"
                    />
                  </Form.Group>

                  {/* Submit & Reset */}
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
