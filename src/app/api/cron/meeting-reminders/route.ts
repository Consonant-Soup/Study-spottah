import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReminderRecipient = {
  meetingId: number;
  profileId: number;
  email: string;
  firstName: string;
  startAt: Date;
  endAt: Date;
  timeZone: string;
  location: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Reminder job is not configured.' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!resendApiKey || !emailFrom) {
    return NextResponse.json({ error: 'Email delivery is not configured.' }, { status: 500 });
  }

  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const claimExpiredBefore = new Date(now.getTime() - 10 * 60 * 1000);
  const recipients = await prisma.$queryRaw<ReminderRecipient[]>`
    SELECT
      participant."meetingId",
      participant."profileId",
      profile."uhemail" AS "email",
      profile."firstName",
      meeting."startAt",
      meeting."endAt",
      meeting."timeZone",
      spot."location"
    FROM "MeetingParticipant" AS participant
    JOIN "Meeting" AS meeting ON meeting."id" = participant."meetingId"
    JOIN "Profile" AS profile ON profile."id" = participant."profileId"
    JOIN "Spot" AS spot ON spot."id" = meeting."spotId"
    WHERE participant."response" = 'accepted'::"MeetingResponse"
      AND participant."reminderSentAt" IS NULL
      AND meeting."status" = 'scheduled'::"MeetingStatus"
      AND meeting."startAt" > ${now}
      AND meeting."startAt" <= ${oneHourFromNow}
  `;

  let sent = 0;
  for (const recipient of recipients) {
    if (recipient.startAt.getTime() - 60 * 60 * 1000 > now.getTime()) continue;

    const claim = await prisma.meetingParticipant.updateMany({
      where: {
        meetingId: recipient.meetingId,
        profileId: recipient.profileId,
        response: 'accepted',
        reminderSentAt: null,
        OR: [
          { reminderClaimedAt: null },
          { reminderClaimedAt: { lt: claimExpiredBefore } },
        ],
      },
      data: { reminderClaimedAt: now },
    });
    if (claim.count === 0) continue;

    const meetingDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: recipient.timeZone,
    }).format(recipient.startAt);
    const startTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: recipient.timeZone,
    }).format(recipient.startAt);
    const endTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: recipient.timeZone,
    }).format(recipient.endAt);
    const text = `Hi ${recipient.firstName},\n\nYour study meeting at ${recipient.location} starts in about an hour, on ${meetingDate} (${startTime}–${endTime}).\n\nSee you there!`;
    const html = `<p>Hi ${escapeHtml(recipient.firstName)},</p><p>Your study meeting at <strong>${escapeHtml(recipient.location)}</strong> starts in about an hour, on ${escapeHtml(meetingDate)} (${escapeHtml(startTime)}–${escapeHtml(endTime)}).</p><p>See you there!</p>`;

    let delivered = false;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `meeting-reminder-${recipient.meetingId}-${recipient.profileId}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [recipient.email],
          subject: `Your study meeting at ${recipient.location} starts in an hour`,
          text,
          html,
        }),
      });
      if (!response.ok) {
        throw new Error(`Resend returned HTTP ${response.status}.`);
      }
      delivered = true;
      sent += 1;
    } finally {
      await prisma.meetingParticipant.update({
        where: {
          meetingId_profileId: {
            meetingId: recipient.meetingId,
            profileId: recipient.profileId,
          },
        },
        data: delivered
          ? { reminderSentAt: new Date(), reminderClaimedAt: null }
          : { reminderClaimedAt: null },
      });
    }
  }

  return NextResponse.json({ sent });
}
