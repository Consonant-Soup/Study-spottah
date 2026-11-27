'use server';

import { MeetingResponse } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { findProfileByEmail, findProfileByUsername } from '@/lib/profile-queries';

type ActionResult = { error?: string; success?: true };

type InviteeLookupResult = {
  error?: string;
  invitee?: { username: string; name: string };
};

async function getCurrentProfile() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  return findProfileByEmail(email);
}

export async function lookupInviteeForMeeting(username: string): Promise<InviteeLookupResult> {
  const convener = await getCurrentProfile();
  if (!convener) return { error: 'Your profile is required to invite people.' };
  if (typeof username !== 'string') return { error: 'Enter a valid username.' };

  const normalizedUsername = username.trim().replace(/^@/, '');
  if (!normalizedUsername || normalizedUsername.length > 50) {
    return { error: 'Enter a valid username.' };
  }

  const invitee = await findProfileByUsername(normalizedUsername);
  if (!invitee) return { error: `No profile exists for @${normalizedUsername}.` };
  if (invitee.id === convener.id) return { error: 'You cannot invite yourself.' };
  if (!invitee.username) return { error: 'That profile does not have a username.' };

  return {
    invitee: {
      username: invitee.username,
      name: `${invitee.firstName} ${invitee.lastName}`,
    },
  };
}

export async function createScheduledMeeting(input: {
  spotId: number;
  inviteeUsernames: string[];
  startAt: string;
  endAt: string;
  timeZone: string;
}): Promise<ActionResult> {
  if (
    !input ||
    !Number.isSafeInteger(input.spotId) ||
    input.spotId <= 0 ||
    !Array.isArray(input.inviteeUsernames) ||
    !input.inviteeUsernames.every((username) => typeof username === 'string') ||
    typeof input.startAt !== 'string' ||
    typeof input.endAt !== 'string' ||
    typeof input.timeZone !== 'string'
  ) {
    return { error: 'Enter valid meeting details.' };
  }

  const convener = await getCurrentProfile();
  if (!convener) return { error: 'Your profile is required to schedule a meeting.' };

  const inviteeUsernames = [...new Set(
    input.inviteeUsernames.map((username) => username.trim().replace(/^@/, '').toLowerCase()),
  )];
  if (
    inviteeUsernames.length === 0 ||
    inviteeUsernames.some((username) => !username || username.length > 50)
  ) {
    return { error: 'Add at least one valid username.' };
  }

  const invitees = await Promise.all(inviteeUsernames.map(findProfileByUsername));
  const missingUsername = inviteeUsernames[invitees.findIndex((invitee) => !invitee)];
  if (missingUsername) return { error: `No profile exists for @${missingUsername}.` };
  const validInvitees = invitees.filter((invitee) => invitee !== null);
  if (validInvitees.some((invitee) => invitee.id === convener.id)) {
    return { error: 'You cannot invite yourself.' };
  }

  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);
  if (
    !Number.isFinite(startAt.getTime()) ||
    !Number.isFinite(endAt.getTime()) ||
    startAt <= new Date() ||
    endAt <= startAt
  ) {
    return { error: 'Choose a future meeting time with an end time after the start.' };
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: input.timeZone });
  } catch {
    return { error: 'The selected time zone is invalid. Please reload and try again.' };
  }

  const spot = await prisma.spot.findUnique({ where: { id: input.spotId } });
  if (!spot) return { error: 'That study spot is no longer available.' };

  await prisma.meeting.create({
    data: {
      spotId: spot.id,
      convenerProfileId: convener.id,
      startAt,
      endAt,
      timeZone: input.timeZone,
      participants: { create: [
        { profileId: convener.id, response: MeetingResponse.accepted },
        ...validInvitees.map((invitee) => ({ profileId: invitee.id })),
      ] },
    },
  });

  revalidatePath('/schedule');
  return { success: true };
}

export async function respondToMeeting(
  meetingId: number,
  response: 'accepted' | 'declined',
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Your profile is required to respond to a meeting.' };
  if (!Number.isSafeInteger(meetingId) || meetingId <= 0) {
    return { error: 'That meeting could not be found.' };
  }
  if (response !== 'accepted' && response !== 'declined') {
    return { error: 'Choose accept or decline.' };
  }

  const updated = await prisma.meetingParticipant.updateMany({
    where: {
      meetingId,
      profileId: profile.id,
      response: MeetingResponse.pending,
      meeting: { status: 'scheduled', startAt: { gt: new Date() } },
    },
    data: { response },
  });
  if (updated.count === 0) {
    return { error: 'This invitation is no longer available to respond to.' };
  }

  revalidatePath('/schedule');
  return { success: true };
}

export async function cancelScheduledMeeting(meetingId: number): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Your profile is required to cancel a meeting.' };
  if (!Number.isSafeInteger(meetingId) || meetingId <= 0) {
    return { error: 'That meeting could not be found.' };
  }

  const updated = await prisma.meeting.updateMany({
    where: {
      id: meetingId,
      convenerProfileId: profile.id,
      status: 'scheduled',
      startAt: { gt: new Date() },
    },
    data: { status: 'cancelled' },
  });
  if (updated.count === 0) {
    return { error: 'Only the convener can cancel an upcoming meeting.' };
  }

  revalidatePath('/schedule');
  return { success: true };
}
