import { redirect } from 'next/navigation';
import ScheduleCalender from '@/components/ScheduleCalender';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';

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
  const spot = Array.isArray(search.spot) ? search.spot[0] : search.spot;

  if (!spot?.trim()) {
    redirect('/schedule');
  }

  return <ScheduleCalender spotName={spot} />;
};

export default ScheduleCalendarPage;
