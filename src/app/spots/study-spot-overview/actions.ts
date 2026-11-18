'use server';

import { Major, NoiseLevel, YesNoUnknown } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { adminProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';

const isYesNoUnknown = (value: string): value is YesNoUnknown =>
  Object.values(YesNoUnknown).some((option) => option === value);

const isNoiseLevel = (value: string): value is NoiseLevel =>
  Object.values(NoiseLevel).some((option) => option === value);

const isMajor = (value: string): value is Major =>
  Object.values(Major).some((option) => option === value);

const readField = (formData: FormData, name: string) => {
  const value = formData.get(name);
  if (typeof value !== 'string') {
    throw new Error(`Missing study spot field: ${name}`);
  }
  return value.trim();
};

const readYesNoUnknown = (formData: FormData, name: string) => {
  const value = readField(formData, name);
  if (!isYesNoUnknown(value)) {
    throw new Error(`Invalid value for study spot field: ${name}`);
  }
  return value;
};

const readMajors = (formData: FormData): Major[] => formData.getAll('majors').map((major) => {
  if (typeof major !== 'string' || !isMajor(major)) {
    throw new Error('Invalid study spot major selection.');
  }
  return major;
});

/** Validate and persist an admin's edits, independently enforcing admin access. */
export async function updateStudySpot(formData: FormData) {
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string; role?: string };
    } | null,
  );

  const idValue = readField(formData, 'id');
  const id = Number(idValue);
  const location = readField(formData, 'location');
  const noiselvlValue = readField(formData, 'noiselvl');
  const majors = readMajors(formData);

  if (!Number.isSafeInteger(id) || id < 1 || location.length === 0) {
    throw new Error('Invalid study spot ID or location.');
  }
  if (!isNoiseLevel(noiselvlValue)) {
    throw new Error('Invalid study spot noise level.');
  }
  const attributes = {
    outdoors: readYesNoUnknown(formData, 'outdoors'),
    ac: readYesNoUnknown(formData, 'ac'),
    microwave: readYesNoUnknown(formData, 'microwave'),
    outlets: readYesNoUnknown(formData, 'outlets'),
    windows: readYesNoUnknown(formData, 'windows'),
    groupstudy: readYesNoUnknown(formData, 'groupstudy'),
    tutors: readYesNoUnknown(formData, 'tutors'),
    printer: readYesNoUnknown(formData, 'printer'),
    foodAllowed: readYesNoUnknown(formData, 'foodAllowed'),
    seating: readYesNoUnknown(formData, 'seating'),
    computers: readYesNoUnknown(formData, 'computers'),
  };

  await prisma.spot.update({
    where: { id },
    data: {
      location,
      ...attributes,
      noiselvl: noiselvlValue,
      majors,
    },
  });

  revalidatePath('/spots/study-spot-overview');
  redirect('/spots/study-spot-overview?updated=1');
}
