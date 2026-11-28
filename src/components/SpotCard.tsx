'use client';

import { Spot } from '@prisma/client';
import { Badge, Card, ListGroup } from 'react-bootstrap';

interface SpotCardProps {
  spot: Spot;
}

const coverageLabel: Record<string, string> = {
  INDOOR: 'Indoor',
  OUTDOOR: 'Outdoor',
  OUTDOOR_COVERED: 'Outdoor w/ Cover',
};

const SpotCard = ({ spot }: SpotCardProps) => {
  const noiseNumber = spot.noiselvl.replace('LEVEL_', '');

  return (
    <Card className="h-100 rounded-0 theme-card">
      <Card.Header as="h5" className="rounded-0 theme-header fw-bold">
        {spot.name}
      </Card.Header>
      <Card.Body style={{ color: '#000000' }}>
        {spot.location && (
          <p className="mb-1"><strong>Location:</strong> {spot.location}</p>
        )}
        <p className="mb-1">
          <strong>Coverage:</strong>{' '}
          <Badge className="rounded-0 badge-theme-major">{coverageLabel[spot.coverage] ?? spot.coverage}</Badge>
        </p>
        <p className="mb-0">
          <strong>Noise Level:</strong> {noiseNumber} / 5
        </p>
      </Card.Body>
      <ListGroup variant="flush" className="small rounded-0">
        <ListGroup.Item>AC: {spot.ac} | Outlets: {spot.outlets}</ListGroup.Item>
        <ListGroup.Item>Group Study: {spot.groupstudy} | Tutors: {spot.tutors}</ListGroup.Item>
        <ListGroup.Item>Printer: {spot.printer} | Computers: {spot.computers}</ListGroup.Item>
        <ListGroup.Item>Microwave: {spot.microwave} | Food Allowed: {spot.foodAllowed}</ListGroup.Item>
        <ListGroup.Item>Whiteboard: {spot.whiteboard} | Projector: {spot.projector}</ListGroup.Item>
        <ListGroup.Item>Windows: {spot.windows} | Chalkboard: {spot.chalkboard}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default SpotCard;