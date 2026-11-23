'use client';

import { Spot } from '@prisma/client';
import { Badge, Card, ListGroup } from 'react-bootstrap';

interface SpotCardProps {
  spot: Spot;
}

const SpotCard = ({ spot }: SpotCardProps) => {
  const noiseNumber = spot.noiselvl.replace('LEVEL_', '');

  return (
    <Card className="h-100 rounded-0 theme-card">
      <Card.Header as="h5" className="rounded-0 theme-header fw-bold">
        {spot.location}
      </Card.Header>
      <Card.Body style={{ color: '#000000' }}>
        <div className="mb-2">
          <strong>Majors: </strong>
          {spot.majors.map((major) => (
            <Badge className="me-1 rounded-0 badge-theme-major" key={major}>
              {major}
            </Badge>
          ))}
          </div>
        <p className="mb-0">
          <strong>Noise Level:</strong> {noiseNumber} / 7
        </p>
      </Card.Body>
      <ListGroup variant="flush" className="small rounded-0">
        <ListGroup.Item>Outdoors: {spot.outdoors} | AC: {spot.ac}</ListGroup.Item>
        <ListGroup.Item>Outlets: {spot.outlets} | Windows: {spot.windows}</ListGroup.Item>
        <ListGroup.Item>Group Study: {spot.groupstudy} | Tutors: {spot.tutors}</ListGroup.Item>
        <ListGroup.Item>Printer: {spot.printer} | Computers: {spot.computers}</ListGroup.Item>
        <ListGroup.Item>Microwave: {spot.microwave} | Food Allowed: {spot.foodAllowed}</ListGroup.Item>
        <ListGroup.Item>Seating: {spot.seating}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default SpotCard;