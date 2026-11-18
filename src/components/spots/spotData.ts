/**
 * spotData.ts
 * Static study spot data for UH Manoa campus.
 * Each spot has coordinates, a name, and descriptive tags.
 * Later this can be replaced with a database query.
 */

export type StudySpot = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
};

/** Sample study spots on UH Manoa campus */
const studySpots: StudySpot[] = [
  {
    id: 1,
    name: 'Hamilton Library',
    description: 'Main campus library with quiet floors and group rooms.',
    lat: 21.3000,
    lng: -157.8162,
    tags: ['Quiet', 'Open late'],
  },
  {
    id: 2,
    name: 'Sinclair Library',
    description: 'Smaller library near the art buildings. Good for focused work.',
    lat: 21.2988,
    lng: -157.8190,
    tags: ['Quiet', 'Cozy'],
  },
  {
    id: 3,
    name: 'Campus Center',
    description: 'Central hub with food options and open seating areas.',
    lat: 21.2990,
    lng: -157.8175,
    tags: ['Food nearby', 'Social'],
  },
  {
    id: 4,
    name: 'Paradise Palms Cafe',
    description: 'Cafe with indoor and outdoor seating. Good coffee.',
    lat: 21.2969,
    lng: -157.8163,
    tags: ['Food nearby', 'Outdoor'],
  },
  {
    id: 5,
    name: 'POST Building Courtyard',
    description: 'Covered outdoor area near the science buildings.',
    lat: 21.2972,
    lng: -157.8155,
    tags: ['Outdoor', 'Open now'],
  },
];

export default studySpots;
