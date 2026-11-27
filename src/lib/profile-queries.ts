import type { Profile } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function findProfileByEmail(email: string): Promise<Profile | null> {
  const profiles = await prisma.$queryRaw<Profile[]>`
    SELECT
      "id",
      "profilepic",
      "uhemail",
      "username",
      "firstName",
      "lastName",
      "major",
      "standing"
    FROM "Profile"
    WHERE "uhemail" = ${email}
    LIMIT 1
  `;
  return profiles[0] ?? null;
}

export async function findProfileByUsername(username: string): Promise<Profile | null> {
  const profiles = await prisma.$queryRaw<Profile[]>`
    SELECT
      "id",
      "profilepic",
      "uhemail",
      "username",
      "firstName",
      "lastName",
      "major",
      "standing"
    FROM "Profile"
    WHERE LOWER("username") = LOWER(${username})
    LIMIT 1
  `;
  return profiles[0] ?? null;
}
