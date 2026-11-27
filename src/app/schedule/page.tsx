import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { findProfileByEmail } from '@/lib/profile-queries';
import { redirect } from 'next/navigation';
import SchedulePageContent from './SchedulePageContent';

type ScheduleMeetingRow = {
  id: number;
  spotLocation: string;
  startAt: Date;
  endAt: Date;
  timeZone: string;
  status: 'scheduled' | 'cancelled';
  response: 'pending' | 'accepted' | 'declined';
  isConvener: boolean;
  otherParticipantResponse: 'pending' | 'accepted' | 'declined';
  otherParticipantName: string;
  otherParticipantUsername: string | null;
};

const SchedulePage = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const email = session?.user?.email;
  if (!email) redirect('/auth/signin');

  const profile = await findProfileByEmail(email);
  if (!profile) redirect('/profile');

  const [spots, rows] = await Promise.all([
    prisma.$queryRaw<{ id: number; location: string }[]>`
      SELECT "id", "location"
      FROM "Spot"
      ORDER BY "location" ASC
    `,
    prisma.$queryRaw<ScheduleMeetingRow[]>`
      SELECT
        meeting."id",
        spot."location" AS "spotLocation",
        meeting."startAt",
        meeting."endAt",
        meeting."timeZone",
        meeting."status",
        viewer."response" AS "response",
        meeting."convenerProfileId" = ${profile.id} AS "isConvener",
        invitee."response" AS "otherParticipantResponse",
        CONCAT(inviteeProfile."firstName", ' ', inviteeProfile."lastName") AS "otherParticipantName",
        inviteeProfile."username" AS "otherParticipantUsername"
      FROM "Meeting" AS meeting
      JOIN "MeetingParticipant" AS viewer
        ON viewer."meetingId" = meeting."id" AND viewer."profileId" = ${profile.id}
      JOIN "MeetingParticipant" AS invitee
        ON invitee."meetingId" = meeting."id" AND invitee."profileId" <> ${profile.id}
      JOIN "Profile" AS inviteeProfile ON inviteeProfile."id" = invitee."profileId"
      JOIN "Spot" AS spot ON spot."id" = meeting."spotId"
      ORDER BY meeting."startAt" ASC
    `,
  ]);

  const meetings = rows.map((meeting) => ({
    ...meeting,
    startAt: meeting.startAt.toISOString(),
    endAt: meeting.endAt.toISOString(),
  }));

  return <SchedulePageContent spots={spots} meetings={meetings} />;
};

export default SchedulePage;
