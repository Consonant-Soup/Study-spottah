export type Service = 'thebus' | 'rainbow';
export type Direction = 'incoming' | 'outgoing';
export type RouteKey = '4' | '6' | '13' | '18' | 'A' | 'U' | 'SH';

export type TransitStop = {
  id: string;
  name: string;
  subtitle: string;
  service: Service;
  routes: RouteKey[];
  // Diagram-only coordinates (percentages), not latitude/longitude.
  x: number;
  y: number;
  stopId?: string;
  side: 'campus' | 'nearby';
  scheduleOffset?: number;
};

export type Arrival = {
  id: string;
  service: Service;
  route: RouteKey;
  routeLabel: string;
  headsign: string;
  direction: Direction;
  stopId: string;
  stopName: string;
  minutes: number;
  timeLabel: string;
  status: 'sample' | 'scheduled' | 'estimated';
};

export type HeaApiResponse = {
  mode: 'not-configured' | 'live' | 'error';
  stop: string;
  arrivals: Arrival[];
  message?: string;
  updatedAt?: string;
};
