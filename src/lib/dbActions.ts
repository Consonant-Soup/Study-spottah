'use server';

import { Condition, YesNoUnknown, NoiseLevel, Coverage, SpotStatus, Standing, Prisma } from '@prisma/client';
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

function toCoverage(value: string): Coverage {
  if (value === 'OUTDOOR') return Coverage.OUTDOOR;
  if (value === 'OUTDOOR_COVERED') return Coverage.OUTDOOR_COVERED;
  return Coverage.INDOOR;
}

export async function addSpots(spot: {
  name: string;
  location?: string;
  coverage: string;
  outlets: string;
  foodAllowed: string;
  microwave: string;
  groupstudy: string;
  ac: string;
  printer: string;
  computers: string;
  whiteboard: string;
  projector: string;
  chalkboard: string;
  windows: string;
  tutors: string;
  freePaper: string;
  largeFormatPrinter: string;
  nearBathroom: string;
  nearWaterFountain: string;
  nearVendingMachine: string;
  nearFoodStore: string;
  nearBusStop: string;
  nearShuttle: string;
  noiselvl: number;
  imageUrl?: string;
  comments?: string;
}) {
  const mappedNoise = noiseLevelMap[spot.noiselvl] ?? NoiseLevel.LEVEL_1;

  await prisma.spot.create({
    data: {
      name: spot.name,
      location: spot.location || null,
      coverage: toCoverage(spot.coverage),
      outlets: toYesNoUnknown(spot.outlets),
      foodAllowed: toYesNoUnknown(spot.foodAllowed),
      microwave: toYesNoUnknown(spot.microwave),
      groupstudy: toYesNoUnknown(spot.groupstudy),
      ac: toYesNoUnknown(spot.ac),
      printer: toYesNoUnknown(spot.printer),
      computers: toYesNoUnknown(spot.computers),
      whiteboard: toYesNoUnknown(spot.whiteboard),
      projector: toYesNoUnknown(spot.projector),
      chalkboard: toYesNoUnknown(spot.chalkboard),
      windows: toYesNoUnknown(spot.windows),
      tutors: toYesNoUnknown(spot.tutors),
      freePaper: toYesNoUnknown(spot.freePaper),
      largeFormatPrinter: toYesNoUnknown(spot.largeFormatPrinter),
      nearBathroom: toYesNoUnknown(spot.nearBathroom),
      nearWaterFountain: toYesNoUnknown(spot.nearWaterFountain),
      nearVendingMachine: toYesNoUnknown(spot.nearVendingMachine),
      nearFoodStore: toYesNoUnknown(spot.nearFoodStore),
      nearBusStop: toYesNoUnknown(spot.nearBusStop),
      nearShuttle: toYesNoUnknown(spot.nearShuttle),
      noiselvl: mappedNoise,
      imageUrl: spot.imageUrl || null,
      comments: spot.comments || null,
    },
  });
  redirect('/spots/study-spot-overview');
}

export async function addProfiles(profile: {
  profilepic?: string;
  uhemail: string;
  username: string;
  firstName: string;
  lastName: string;
  major: string;
  standing: string;
}): Promise<{ error?: string }> {
  const data = {
    profilepic: profile.profilepic || null,
    uhemail: profile.uhemail,
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    major: profile.major,
    standing: standing(profile.standing),
  };

  try {
    await prisma.profile.upsert({
      where: { uhemail: profile.uhemail },
      update: data,
      create: data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'That email or username is already in use.' };
    }
    throw error;
  }

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

export async function approveSpot(id: number) {
  await prisma.spot.update({
    where: { id },
    data: { status: SpotStatus.APPROVED },
  });
  revalidatePath('/admin');
  revalidatePath('/spots');
}

export async function rejectSpot(id: number) {
  await prisma.spot.update({
    where: { id },
    data: { status: SpotStatus.REJECTED },
  });
  revalidatePath('/admin');
  revalidatePath('/spots');
}

export async function getPendingSpots() {
  return prisma.spot.findMany({
    where: { status: SpotStatus.PENDING },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getApprovedSpots() {
  return prisma.spot.findMany({
    where: { status: SpotStatus.APPROVED },
    orderBy: { createdAt: 'desc' },
  });
}