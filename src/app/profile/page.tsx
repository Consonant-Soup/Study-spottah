import { Role, type Spot } from '@prisma/client';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { findProfileByEmail } from '@/lib/profile-queries';
import AddProfileForm from '@/components/AddProfileForm';
import ProfileView from '@/components/SpotsProfile';
import AdminProfileView from '@/components/SpotsAdminProfile';

const ProfilePage = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const userEmail = session?.user?.email || '';

  const [profile, currentUser] = await Promise.all([
    findProfileByEmail(userEmail),
    prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true },
    }),
  ]);

  // 1. Check for missing profile FIRST so TypeScript narrows `profile` to non-null below
  if (!profile) {
    return (
      <main>
        <AddProfileForm defaultEmail={userEmail} />
      </main>
    );
  }

  // 2. Check if the logged-in user is an admin
  const isAdmin = currentUser?.role === Role.ADMIN;

  if (isAdmin) {
    const [totalUsers, totalProfiles, spots] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.$queryRaw<Spot[]>`
        SELECT *
        FROM "Spot"
        ORDER BY "id" DESC
      `,
    ]);

    return (
      <main>
        <AdminProfileView
          profile={profile}
          totalUsers={totalUsers}
          totalProfiles={totalProfiles}
          spots={spots}
        />
      </main>
    );
  }

  return (
    <main>
      <ProfileView profile={profile} />
    </main>
  );
};

export default ProfilePage;
