import { THEBUS_STOPS } from './data';
import type { Arrival, RouteKey } from './types';

type RawArrival = {
  id?: string | number;
  route?: string;
  headsign?: string;
  direction?: string;
  estimated?: string | number;
  stopTime?: string;
  date?: string;
  canceled?: string | number;
};

type RawResponse = { arrivals?: RawArrival[]; errorMessage?: string };

// The HEA API is a server-only integration. Never expose its registered AppID
// via NEXT_PUBLIC_ variables or put the key into the browser bundle.
const HEA_ENDPOINT = 'http://api.thebus.org/arrivalsJSON/';

function normalizeRoute(input: string): RouteKey | null {
  const route = input.toUpperCase().replace(/\s+/g, ' ').trim();
  if (route === 'A' || route === 'A LINE') return 'A';
  if (route === 'U' || route === 'U LINE') return 'U';
  if (['4', '6', '13', '18'].includes(route)) return route as RouteKey;
  return null;
}

function parseHonoluluTimestamp(dateText?: string, timeText?: string): number | null {
  const date = dateText?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const time = timeText?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!date || !time) return null;
  const hour12 = Number(time[1]);
  const hour24 = (hour12 % 12) + (time[3].toUpperCase() === 'PM' ? 12 : 0);
  // Honolulu is permanently UTC-10, and does not observe daylight saving time.
  return Date.UTC(Number(date[3]), Number(date[1]) - 1, Number(date[2]), hour24 + 10, Number(time[2]));
}

export async function fetchHeaArrivals(stopId: string, apiKey: string, now = new Date()): Promise<Arrival[]> {
  const stop = THEBUS_STOPS.find((item) => item.stopId === stopId);
  if (!stop) throw new Error('Unsupported stop. Add verified stops in transit/data.ts.');
  const url = new URL(HEA_ENDPOINT);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('stop', stopId);
  const response = await fetch(url.toString(), { next: { revalidate: 30 }, signal: AbortSignal.timeout(9000) });
  if (!response.ok) throw new Error(`HEA responded with status ${response.status}`);
  const data = await response.json() as RawResponse;
  if (data.errorMessage) throw new Error(data.errorMessage);
  if (!Array.isArray(data.arrivals)) throw new Error('HEA response did not include an arrivals array');

  return data.arrivals.flatMap((raw) => {
    const route = normalizeRoute(String(raw.route ?? ''));
    if (!route || String(raw.canceled ?? '0') === '1') return [];
    const arrivalTime = parseHonoluluTimestamp(raw.date, raw.stopTime);
    if (arrivalTime === null) return [];
    const minutes = Math.ceil((arrivalTime - now.getTime()) / 60000);
    if (minutes < -1 || minutes > 240) return [];
    return [{
      id: String(raw.id ?? `${stopId}-${route}-${arrivalTime}`),
      service: 'thebus' as const,
      route,
      routeLabel: route === 'A' ? 'A Line' : route === 'U' ? 'U Line' : route,
      headsign: raw.headsign || 'Check bus headsign',
      direction: raw.direction?.toLowerCase() === 'eastbound' ? 'incoming' as const : 'outgoing' as const,
      stopId: stop.id,
      stopName: stop.name,
      minutes: Math.max(0, minutes),
      timeLabel: raw.stopTime ?? '',
      status: String(raw.estimated) === '1' ? 'estimated' as const : 'scheduled' as const,
    }];
  }).sort((a, b) => a.minutes - b.minutes);
}
