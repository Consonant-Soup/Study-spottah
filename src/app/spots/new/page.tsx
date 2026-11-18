import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import AddSpotForm from '@/components/AddSpotForm';

const AddSpot = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main>
      <AddSpotForm />
    </main>
  );
};

export default AddSpot;
