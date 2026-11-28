import type { Spot } from '@prisma/client';

export const TAG_ORDER = [
  'Indoor', 'Outdoor', 'Outdoor Covered',
  'AC', 'Outlets', 'Food Allowed', 'Microwave',
  'Group Study', 'Printer', 'Computers', 'TAs',
] as const;

export function getSpotTags(spot: Spot): string[] {
  const tags: string[] = [];

  if (spot.coverage === 'INDOOR') tags.push('Indoor');
  if (spot.coverage === 'OUTDOOR') tags.push('Outdoor');
  if (spot.coverage === 'OUTDOOR_COVERED') tags.push('Outdoor Covered');

  if (spot.ac === 'yes') tags.push('AC');
  if (spot.outlets === 'yes') tags.push('Outlets');
  if (spot.foodAllowed === 'yes') tags.push('Food Allowed');
  if (spot.microwave === 'yes') tags.push('Microwave');
  if (spot.groupstudy === 'yes') tags.push('Group Study');
  if (spot.printer === 'yes') tags.push('Printer');
  if (spot.computers === 'yes') tags.push('Computers');
  if (spot.tutors === 'yes') tags.push('TAs');

  return tags;
}

export function getNoiseNumber(spot: Spot): number {
  return parseInt(spot.noiselvl.replace('LEVEL_', ''), 10);
}

export function noiseLabel(level: number): string {
  if (level <= 2) return 'Quiet';
  if (level <= 3) return 'Moderate';
  if (level <= 4) return 'Lively';
  return 'Noisy';
}
