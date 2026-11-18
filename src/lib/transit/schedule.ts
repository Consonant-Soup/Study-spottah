import type { Arrival, TransitStop } from './types';

// Every calculation is made in Honolulu time. The browser's own timezone
// may be different for students viewing campus from elsewhere.
export function getHonoluluClock(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Pacific/Honolulu',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    weekday: value('weekday'),
    hour: Number(value('hour')) % 24,
    minute: Number(value('minute')),
    label: new Intl.DateTimeFormat('en-US', {
      timeZone: 'Pacific/Honolulu', hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(now),
  };
}

export function formatHhMm(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

// Official 2026 schedule starts at 07:00 and 07:30 every half hour through
// 16:30. Stop-specific minute offsets follow the UH published timetable.
export function getNextRainbowDepartures(stop: TransitStop, now: Date = new Date(), count = 3): Arrival[] {
  if (stop.service !== 'rainbow') return [];
  const clock = getHonoluluClock(now);
  if (clock.weekday === 'Sat' || clock.weekday === 'Sun') return [];
  const currentMinutes = clock.hour * 60 + clock.minute;
  const offset = stop.scheduleOffset ?? 0;
  const rows: Arrival[] = [];
  for (let base = 7 * 60; base <= 16 * 60 + 30; base += 30) {
    const at = base + offset;
    const minutes = at - currentMinutes;
    if (minutes < 0) continue;
    rows.push({
      id: `sh-${stop.id}-${base}`, service: 'rainbow', route: 'SH', routeLabel: 'Rainbow',
      headsign: 'Campus loop · Student Housing', direction: 'incoming',
      stopId: stop.id, stopName: stop.name, minutes,
      timeLabel: formatHhMm(at), status: 'scheduled',
    });
    if (rows.length >= count) break;
  }
  return rows;
}

// Design-only sample data, never presented as a live or verified timetable.
const BUS_EXAMPLES = [
  { route: 'A' as const, headsign: 'Āhua Skyline Station', direction: 'outgoing' as const, minutes: 6, stop: 'bus-983' },
  { route: '13' as const, headsign: 'UH Mānoa', direction: 'incoming' as const, minutes: 8, stop: 'bus-4550' },
  { route: '6' as const, headsign: 'Woodlawn Drive', direction: 'incoming' as const, minutes: 12, stop: 'bus-413' },
  { route: 'U' as const, headsign: 'Āhua Skyline Station', direction: 'outgoing' as const, minutes: 15, stop: 'bus-3674' },
  { route: '4' as const, headsign: 'McCully', direction: 'outgoing' as const, minutes: 19, stop: 'bus-297' },
  { route: '13' as const, headsign: 'Liliha / Puʻunui', direction: 'outgoing' as const, minutes: 24, stop: 'bus-4550' },
];

export function getDemoBusArrivals(stops: TransitStop[], now: Date = new Date()): Arrival[] {
  const mins = getHonoluluClock(now);
  const current = mins.hour * 60 + mins.minute;
  return BUS_EXAMPLES.flatMap((entry) => {
    const stop = stops.find((candidate) => candidate.id === entry.stop);
    if (!stop) return [];
    return [{
      id: `demo-${entry.route}-${entry.stop}`, service: 'thebus' as const,
      route: entry.route, routeLabel: entry.route === 'A' ? 'A Line' : entry.route === 'U' ? 'U Line' : entry.route,
      headsign: entry.headsign, direction: entry.direction,
      stopId: stop.id, stopName: stop.name, minutes: entry.minutes,
      timeLabel: formatHhMm(current + entry.minutes), status: 'sample' as const,
    }];
  });
}
