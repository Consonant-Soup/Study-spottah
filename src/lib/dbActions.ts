'use server';

import { Condition, YesNoUnknown, NoiseLevel, Major, Standing } from '@prisma/client';
import { Stuff } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

// For adding new spots to the website
const noiseLevelMap: Record<number, NoiseLevel> = {
  1: NoiseLevel.LEVEL_1,
  2: NoiseLevel.LEVEL_2,
  3: NoiseLevel.LEVEL_3,
  4: NoiseLevel.LEVEL_4,
  5: NoiseLevel.LEVEL_5,
  6: NoiseLevel.LEVEL_6,
  7: NoiseLevel.LEVEL_7,
};

function toYesNoUnknown(value: string): YesNoUnknown {
  if (value === 'yes') return YesNoUnknown.yes;
  if (value === 'no') return YesNoUnknown.no;
  return YesNoUnknown.unknown;
}

function standing(value: string): Standing {
  if (value == 'freshman') return Standing.freshman;
  if (value == 'sophmore') return Standing.sophmore;
  if (value == 'junior') return Standing.junior;
  if (value == 'senior') return Standing.senior;
  if (value == 'masters') return Standing.masters;
  if (value == 'phd') return Standing.phd;
  return Standing.freshman;
};

/**
 * Adds a new location to the database.
 * @param spot, an object with the following properties:
 *  location
 *  outdoors
 *  ac
 *  microwave
 *  windows
 *  outlests
 *  groupstudy
 *  tutors
 *  printer
 *  noise level
 *  is food allowd
 *  majors
 *  setaing
 *  computers
 */
export async function addSpots(spot: { location: string; outdoors: string, ac: string, microwave: string, outlets: string, windows: string, groupstudy: string, tutors: string, printer: string, noiselvl: number, foodAllowed: string, majors: string[], seating: string, computers:string}) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  const mappedNoise = noiseLevelMap[spot.noiselvl] ?? NoiseLevel.LEVEL_1;

  await prisma.spot.create({
    data: {
      location: spot.location,
      outdoors: toYesNoUnknown(spot.outdoors),
      ac: toYesNoUnknown(spot.ac),
      microwave: toYesNoUnknown(spot.microwave),
      outlets: toYesNoUnknown(spot.outlets),
      windows: toYesNoUnknown(spot.windows),
      groupstudy: toYesNoUnknown(spot.groupstudy),
      tutors: toYesNoUnknown(spot.tutors),
      printer: toYesNoUnknown(spot.printer),
      noiselvl: mappedNoise,
      foodAllowed: toYesNoUnknown(spot.foodAllowed),
      majors: spot.majors as Major[],
      seating: toYesNoUnknown(spot.seating),
      computers: toYesNoUnknown(spot.computers),
    },
  });
  // After adding, redirect to the list of study spots as a card 
  redirect('/list');
}

export async function addProfiles(profile: {
  profilepic?: string;
  uhemail: string;
  username: string;
  firstName: string;
  lastName: string;
  major: string;
  standing: string;
}) {
  await prisma.profile.create({
    data: {
      profilepic: profile.profilepic || null,
      uhemail: profile.uhemail,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      major: profile.major,
      standing: standing(profile.standing),
    },
  });
  redirect('/schedule');
}


/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

// 1. Update Username
export async function updateUsername(uhemail: string, newUsername: string) {
  await prisma.profile.update({
    where: { uhemail },
    data: { username: newUsername },
  });
  revalidatePath('/profile');
}

// 2. Update Email (updates both User login and Profile record)
export async function updateEmail(oldEmail: string, newEmail: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: { email: oldEmail },
      data: { email: newEmail },
    }),
    prisma.profile.update({
      where: { uhemail: oldEmail },
      data: { uhemail: newEmail },
    }),
  ]);
  revalidatePath('/profile');
}

// 4. Update Profile Picture URL
export async function updateProfilePic(uhemail: string, profilepic: string) {
  await prisma.profile.update({
    where: { uhemail },
    data: { profilepic: profilepic || null },
  });
  revalidatePath('/profile');
}

// 3. Update Password (hashes password on User model)
export async function updatePassword(email: string, newPassword: string) {
  const hashedPassword = await hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}

export async function deleteSpot(id: number) {
  await prisma.spot.delete({
    where: { id },
  });
  revalidatePath('/profile');
  revalidatePath('/spots');
}