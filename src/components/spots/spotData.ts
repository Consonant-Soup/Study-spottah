/**
 * spotData.ts
 * Study spot data for UH Manoa campus.
 * Each spot has amenity tags (one per category) plus live indicators.
 */

export type SeatingLevel = 'Totally empty' | 'Many' | 'Some' | 'Very little' | 'None';

export type StudySpot = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  noiseLevel: number;
  seating: SeatingLevel;
};

/** Ordered list of all possible filter tags */
export const TAG_ORDER: string[] = [
  'AC', 'Outdoors', 'Outdoors covered',
  'Food Allowed', 'Outlets', 'Microwave',
  'Tutors', 'Printer',
];

const studySpots: StudySpot[] = [
  {
    id: 1,
    name: 'First Floor, Hamilton Library',
    description: 'Main floor with reference desks, group tables, and printing stations.',
    lat: 21.3000,
    lng: -157.8162,
    tags: ['AC', 'Outlets', 'Printer'],
    noiseLevel: 3,
    seating: 'Many',
  },
  {
    id: 2,
    name: 'Fourth Floor Study Area, Hamilton Library',
    description: 'Quiet upper floor with individual carrels and natural light.',
    lat: 21.3001,
    lng: -157.8160,
    tags: ['AC', 'Outlets'],
    noiseLevel: 1,
    seating: 'Some',
  },
  {
    id: 3,
    name: 'Learning Commons, Sinclair Library',
    description: 'Collaborative space with tutoring services and tech support.',
    lat: 21.2988,
    lng: -157.8190,
    tags: ['AC', 'Outlets', 'Tutors', 'Printer'],
    noiseLevel: 3,
    seating: 'Many',
  },
  {
    id: 4,
    name: 'Second Floor Food Court, Campus Center',
    description: 'Open seating near food vendors. Great for casual study sessions.',
    lat: 21.2990,
    lng: -157.8175,
    tags: ['AC', 'Food Allowed', 'Outlets'],
    noiseLevel: 6,
    seating: 'Many',
  },
  {
    id: 5,
    name: 'Courtyard, Sakamaki Hall',
    description: 'Shaded outdoor courtyard between classroom wings.',
    lat: 21.2985,
    lng: -157.8178,
    tags: ['Outdoors covered', 'Food Allowed'],
    noiseLevel: 4,
    seating: 'Some',
  },
  {
    id: 6,
    name: 'Lanai, Paradise Palms',
    description: 'Covered patio with cafe access. Good coffee and shade.',
    lat: 21.2969,
    lng: -157.8163,
    tags: ['Outdoors covered', 'Food Allowed'],
    noiseLevel: 5,
    seating: 'Very little',
  },
  {
    id: 7,
    name: 'Study Room 301, POST Building',
    description: 'Reservable group study room near the science departments.',
    lat: 21.2972,
    lng: -157.8155,
    tags: ['AC', 'Outlets'],
    noiseLevel: 1,
    seating: 'Some',
  },
  {
    id: 8,
    name: 'Great Lawn, McCarthy Mall',
    description: 'Wide open grass area in the center of campus. Bring a blanket.',
    lat: 21.2982,
    lng: -157.8170,
    tags: ['Outdoors', 'Food Allowed'],
    noiseLevel: 4,
    seating: 'Totally empty',
  },
  {
    id: 9,
    name: 'Computer Lab, Keller Hall',
    description: 'Lab with workstations, printing, and drop-in tutoring hours.',
    lat: 21.2975,
    lng: -157.8148,
    tags: ['AC', 'Outlets', 'Microwave', 'Tutors', 'Printer'],
    noiseLevel: 2,
    seating: 'Very little',
  },
  {
    id: 10,
    name: 'Student Lounge, Holmes Hall',
    description: 'Engineering building lounge with couches, microwave, and outlets.',
    lat: 21.2978,
    lng: -157.8143,
    tags: ['AC', 'Food Allowed', 'Outlets', 'Microwave'],
    noiseLevel: 5,
    seating: 'Some',
  },
];

export default studySpots;
