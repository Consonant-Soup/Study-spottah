import { notFound, redirect } from 'next/navigation';
import ScheduleCalender from '@/components/ScheduleCalender';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';

type ScheduleCalendarPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ScheduleCalendarPage = async ({ searchParams }: ScheduleCalendarPageProps) => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const search = await searchParams;
  const rawSpotId = Array.isArray(search.spot) ? search.spot[0] : search.spot;
  const spotId = Number(rawSpotId);

  if (!Number.isSafeInteger(spotId) || spotId <= 0) {
    redirect('/schedule');
  }

  const spot = await prisma.spot.findUnique({
    where: { id: spotId },
    select: { id: true, location: true },
  });
  if (!spot) notFound();

  return <ScheduleCalender spotId={spot.id} spotName={spot.location} />;
};

export default ScheduleCalendarPage;
