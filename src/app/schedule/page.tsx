import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import SchedulePageContent from './SchedulePageContent';

const SchedulePage = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  return <SchedulePageContent />;
};

export default SchedulePage;
