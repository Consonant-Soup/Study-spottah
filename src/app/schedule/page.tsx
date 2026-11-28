import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { getApprovedSpots } from '@/lib/dbActions';
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
  otherParticipants: {
    response: 'pending' | 'accepted' | 'declined';
    name: string;
    username: string | null;
  }[];
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

  const [approvedSpots, rows] = await Promise.all([
    getApprovedSpots(),
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
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'response', attendee."response",
              'name', CONCAT(attendeeProfile."firstName", ' ', attendeeProfile."lastName"),
              'username', attendeeProfile."username"
            )
          ) FILTER (WHERE attendee."profileId" IS NOT NULL),
          '[]'::json
        ) AS "otherParticipants"
      FROM "Meeting" AS meeting
      JOIN "MeetingParticipant" AS viewer
        ON viewer."meetingId" = meeting."id" AND viewer."profileId" = ${profile.id}
      LEFT JOIN "MeetingParticipant" AS attendee
        ON attendee."meetingId" = meeting."id" AND attendee."profileId" <> ${profile.id}
      LEFT JOIN "Profile" AS attendeeProfile ON attendeeProfile."id" = attendee."profileId"
      JOIN "Spot" AS spot ON spot."id" = meeting."spotId"
      WHERE meeting."status" = 'scheduled'::"MeetingStatus"
        AND meeting."endAt" > NOW()
      GROUP BY meeting."id", spot."location", viewer."response"
      ORDER BY meeting."startAt" ASC
    `,
  ]);

  const meetings = rows.map((meeting) => ({
    ...meeting,
    startAt: meeting.startAt.toISOString(),
    endAt: meeting.endAt.toISOString(),
  }));

  return <SchedulePageContent spots={approvedSpots} meetings={meetings} />;
};

export default SchedulePage;
