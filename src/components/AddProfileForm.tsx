'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { AddProfileSchema } from '@/lib/validationSchemas';
import { addProfiles } from '@/lib/dbActions';

type ProfileFormValues = Yup.InferType<typeof AddProfileSchema>;

interface AddProfileFormProps {
  defaultEmail?: string;
}

const AddProfileForm: React.FC<AddProfileFormProps> = ({ defaultEmail = '' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(AddProfileSchema),
    defaultValues: {
      uhemail: defaultEmail,
      username: '',
      standing: 'freshman',
      firstName: '',
      lastName: '',
      major: '',
      profilepic: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    swal('Success', 'Your profile has been created!', 'success', {
      timer: 2000,
    });
    await addProfiles(data);
  };

  const handleReset = () => {
    reset({
      uhemail: defaultEmail,
      username: '',
      standing: 'freshman',
      firstName: '',
      lastName: '',
      major: '',
      profilepic: '',
    });
  };

  return (
    <div style={{ backgroundColor: '#F5F7FC' }}>
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Col className="text-center">
              <h2 className="fw-bold" style={{ color: '#000000' }}>
                Add Profile
              </h2>
            </Col>
            <Card className="rounded-0 theme-card" style={{ backgroundColor: '#ffffff' }}>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* First Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`form-control rounded-0 ${errors.firstName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                  </Form.Group>

                  {/* Last Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`form-control rounded-0 ${errors.lastName ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      readOnly={Boolean(defaultEmail)}
                      {...register('uhemail')}
                      className={`form-control rounded-0 ${errors.uhemail ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.uhemail?.message}</div>
                  </Form.Group>

                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <input
                      type="text"
                      {...register('username')}
                      className={`form-control rounded-0 ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.uhemail?.message}</div>
                  </Form.Group>

                  {/* Major */}
                  <Form.Group className="mb-3">
                    <Form.Label>Major</Form.Label>
                    <input
                      type="text"
                      {...register('major')}
                      className={`form-control rounded-0 ${errors.major ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.major?.message}</div>
                  </Form.Group>

                  {/* Standing */}
                  <Form.Group className="mb-3">
                    <Form.Label>Standing</Form.Label>
                    <select
                      {...register('standing')}
                      className={`form-select rounded-0 ${errors.standing ? 'is-invalid' : ''}`}
                    >
                      <option value="freshman">Freshman</option>
                      <option value="sophmore">Sophomore</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                      <option value="masters">Masters</option>
                      <option value="phd">PhD</option>
                    </select>
                    <div className="invalid-feedback">{errors.standing?.message}</div>
                  </Form.Group>

                  {/* Profile Picture URL (Optional) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture URL (Optional)</Form.Label>
                    <input
                      type="text"
                      placeholder="https://..."
                      {...register('profilepic')}
                      className={`form-control rounded-0 ${errors.profilepic ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.profilepic?.message}</div>
                  </Form.Group>

                  {/* Submit & Reset Buttons */}
                  <Form.Group className="form-group pt-2">
                    <Row>
                      <Col>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting}
                          className="rounded-0 w-100"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          onClick={handleReset}
                          variant="warning"
                          className="rounded-0 w-100"
                        >
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

export default AddProfileForm;
