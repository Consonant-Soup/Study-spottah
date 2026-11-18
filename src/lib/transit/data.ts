import type { RouteKey, TransitStop } from './types';

// Verified TheBus stop numbers are recorded where published by HEA/UH.
// Display coordinates are an illustrative campus schematic, not navigation data.
export const THEBUS_STOPS: TransitStop[] = [
  { id: 'bus-983', name: 'Sinclair Circle', subtitle: 'A Line • campus', service: 'thebus', routes: ['A'], x: 22, y: 55, stopId: '983', side: 'campus' },
  { id: 'bus-3674', name: 'Dole / East-West Rd', subtitle: 'Outbound • U Line / 13', service: 'thebus', routes: ['U', '13'], x: 67, y: 69, stopId: '3674', side: 'campus' },
  { id: 'bus-4550', name: 'Dole / Opp East-West', subtitle: 'Inbound • U Line / 13', service: 'thebus', routes: ['U', '13'], x: 72, y: 73, stopId: '4550', side: 'campus' },
  { id: 'bus-297', name: 'University / Dole', subtitle: 'West campus entrance', service: 'thebus', routes: ['4', '6', '13'], x: 14, y: 76, stopId: '297', side: 'campus' },
  { id: 'bus-413', name: 'University / Metcalf', subtitle: 'Southbound', service: 'thebus', routes: ['4', '6'], x: 12, y: 90, stopId: '413', side: 'nearby' },
  { id: 'bus-874', name: 'University / Opp Metcalf', subtitle: 'Northbound', service: 'thebus', routes: ['6', '13'], x: 17, y: 94, stopId: '874', side: 'nearby' },
  { id: 'bus-298', name: 'Metcalf / University', subtitle: 'Neighborhood stop', service: 'thebus', routes: ['4'], x: 7, y: 85, stopId: '298', side: 'nearby' },
  { id: 'bus-865', name: 'Maile Way (West)', subtitle: 'Northern campus corridor', service: 'thebus', routes: ['6'], x: 27, y: 9, stopId: '865', side: 'campus' },
  { id: 'bus-864', name: 'Maile Way (East)', subtitle: 'Northern campus corridor', service: 'thebus', routes: ['6'], x: 80, y: 9, stopId: '864', side: 'campus' },
  { id: 'bus-4547', name: 'Maile / Business Admin', subtitle: 'Northwest campus', service: 'thebus', routes: ['13'], x: 35, y: 14, stopId: '4547', side: 'campus' },
  { id: 'bus-809', name: 'University Ave (North)', subtitle: 'Northwest campus', service: 'thebus', routes: ['6'], x: 9, y: 17, stopId: '809', side: 'campus' },
  { id: 'bus-4548', name: 'Maile / Hamilton', subtitle: 'Northeast campus', service: 'thebus', routes: ['13'], x: 82, y: 17, stopId: '4548', side: 'campus' },
  { id: 'bus-4549', name: 'East-West / Jefferson', subtitle: 'East campus corridor', service: 'thebus', routes: ['13'], x: 88, y: 43, stopId: '4549', side: 'campus' },
  { id: 'bus-863', name: 'East-West Road (North)', subtitle: 'East campus corridor', service: 'thebus', routes: ['6'], x: 95, y: 33, stopId: '863', side: 'campus' },
  { id: 'bus-862', name: 'East-West Road (South)', subtitle: 'East campus corridor', service: 'thebus', routes: ['6'], x: 92, y: 61, stopId: '862', side: 'campus' },
  { id: 'bus-4330', name: 'Dole / Bachman', subtitle: 'Campus Road connection', service: 'thebus', routes: ['13'], x: 40, y: 77, stopId: '4330', side: 'campus' },
  { id: 'bus-4860', name: 'Dole / Law School (E)', subtitle: 'U Line stop', service: 'thebus', routes: ['U'], x: 49, y: 82, stopId: '4860', side: 'campus' },
  { id: 'bus-4861', name: 'Dole / Law School (W)', subtitle: 'U Line stop', service: 'thebus', routes: ['U'], x: 54, y: 86, stopId: '4861', side: 'campus' },
  { id: 'bus-860', name: 'Dole / Lower Campus', subtitle: 'South campus corridor', service: 'thebus', routes: ['6'], x: 43, y: 88, stopId: '860', side: 'campus' },
  { id: 'bus-861', name: 'Dole / Law Library', subtitle: 'South campus corridor', service: 'thebus', routes: ['6'], x: 62, y: 88, stopId: '861', side: 'campus' },
  { id: 'bus-414', name: 'University / Orvis', subtitle: 'Southwest campus', service: 'thebus', routes: ['4', '6'], x: 8, y: 73, stopId: '414', side: 'nearby' },
  { id: 'bus-415', name: 'Varsity Place', subtitle: 'Near campus', service: 'thebus', routes: ['4', '6'], x: 5, y: 95, stopId: '415', side: 'nearby' },
  { id: 'bus-296', name: 'University / Coyne', subtitle: 'Near campus', service: 'thebus', routes: ['4', '6', 'A'], x: 25, y: 96, stopId: '296', side: 'nearby' },
];

// Official Student Housing / Hawaiian Studies timetable, with 30-minute cycles.
// The official text and map disagree on Wainani vs Noelani order; the published
// timetable's time columns are used here. See README for the discrepancy.
export const SHUTTLE_STOPS: TransitStop[] = [
  { id: 'sh-hawaiian', name: 'Hawaiian Studies', subtitle: 'Kamakakūokalani • start', service: 'rainbow', routes: ['SH'], x: 82, y: 82, side: 'campus', scheduleOffset: 0 },
  { id: 'sh-frear', name: 'Frear Hall', subtitle: 'Student housing', service: 'rainbow', routes: ['SH'], x: 70, y: 77, side: 'campus', scheduleOffset: 1 },
  { id: 'sh-wainani', name: 'Hale Wainani', subtitle: 'Residence halls', service: 'rainbow', routes: ['SH'], x: 63, y: 92, side: 'campus', scheduleOffset: 2 },
  { id: 'sh-noelani', name: 'Hale Noelani', subtitle: 'Residence halls', service: 'rainbow', routes: ['SH'], x: 75, y: 91, side: 'campus', scheduleOffset: 6 },
  { id: 'sh-burns', name: 'Burns Hall', subtitle: 'East-West Road', service: 'rainbow', routes: ['SH'], x: 67, y: 58, side: 'campus', scheduleOffset: 9 },
  { id: 'sh-jefferson', name: 'Jefferson Hall', subtitle: 'East-West Road', service: 'rainbow', routes: ['SH'], x: 71, y: 37, side: 'campus', scheduleOffset: 10 },
  { id: 'sh-stjohn', name: 'St. John', subtitle: 'Plant Science Lab', service: 'rainbow', routes: ['SH'], x: 64, y: 18, side: 'campus', scheduleOffset: 12 },
  { id: 'sh-varney', name: 'Varney Circle', subtitle: 'Main campus loop', service: 'rainbow', routes: ['SH'], x: 27, y: 22, side: 'campus', scheduleOffset: 21 },
  { id: 'sh-paradise', name: 'Paradise Palms', subtitle: 'Near the food court', service: 'rainbow', routes: ['SH'], x: 55, y: 23, side: 'campus', scheduleOffset: 22 },
  { id: 'sh-kennedy', name: 'Kennedy Theatre', subtitle: 'Arts district', service: 'rainbow', routes: ['SH'], x: 58, y: 38, side: 'campus', scheduleOffset: 24 },
  { id: 'sh-dole', name: 'Dole / Gateway House', subtitle: 'Student housing', service: 'rainbow', routes: ['SH'], x: 63, y: 73, side: 'campus', scheduleOffset: 27 },
];

export const ALL_STOPS: TransitStop[] = [...THEBUS_STOPS, ...SHUTTLE_STOPS];

export const ROUTE_DETAILS: Record<RouteKey, { name: string; desc: string; color: string }> = {
  '4': { name: '4', desc: 'Nuʻuanu / McCully via UH', color: '#91a8eb' },
  '6': { name: '6', desc: 'Pauoa / Woodlawn', color: '#91a8eb' },
  '13': { name: '13', desc: 'Liliha / Waikīkī via UH', color: '#91a8eb' },
  '18': { name: '18', desc: 'University / Ala Moana', color: '#91a8eb' },
  'A': { name: 'A Line', desc: 'Āhua Skyline / Sinclair Circle', color: '#91a8eb' },
  'U': { name: 'U Line', desc: 'Āhua Skyline / Dole St', color: '#91a8eb' },
  'SH': { name: 'Rainbow', desc: 'Student Housing / Hawaiian Studies', color: '#7d9946' },
};

export const SOURCES = {
  rainbowSchedule: 'https://manoa.hawaii.edu/commuter/rainbow-shuttle/student-housing-hawaiian-studies-rainbow-shuttle-route/',
  rainbowOverview: 'https://manoa.hawaii.edu/commuter/rainbow-shuttle/',
  theBusUH: 'https://manoa.hawaii.edu/commuter/thebus/',
  theBusHea: 'https://hea.thebus.org/',
  theBusApi: 'https://hea.thebus.org/api_info.asp',
  skyline: 'https://manoa.hawaii.edu/commuter/skyline/',
  officialMap: 'https://manoa.hawaii.edu/commuter/wp-content/uploads/sites/6/2025/08/sh-haw-route-map.jpg',
  officialBusMap: 'https://www.thebus.org/Updates/Manoaflyer2025RAIL.pdf',
};
