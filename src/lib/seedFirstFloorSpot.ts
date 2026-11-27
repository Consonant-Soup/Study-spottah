import type { PrismaClient } from '@prisma/client';

export async function seedFirstFloorSpot(prisma: Pick<PrismaClient, '$executeRaw'>) {
  const location = 'First Floor, Hamilton Library';

  await prisma.$executeRaw`
    INSERT INTO "Spot" (
      "location",
      "outdoors",
      "ac",
      "microwave",
      "outlets",
      "windows",
      "groupstudy",
      "tutors",
      "printer",
      "noiselvl",
      "foodAllowed",
      "majors",
      "seating",
      "computers"
    )
    SELECT
      ${location},
      'no'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      '3'::"NoiseLevel",
      'no'::"YesNoUnknown",
      ARRAY['Engineering', 'Bio', 'Math']::"Major"[],
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown"
    WHERE NOT EXISTS (
      SELECT 1 FROM "Spot" WHERE "location" = ${location}
    )
  `;

  await prisma.$executeRaw`
    UPDATE "Spot"
    SET
      "outdoors" = 'no'::"YesNoUnknown",
      "ac" = 'yes'::"YesNoUnknown",
      "microwave" = 'unknown'::"YesNoUnknown",
      "outlets" = 'yes'::"YesNoUnknown",
      "windows" = 'yes'::"YesNoUnknown",
      "groupstudy" = 'yes'::"YesNoUnknown",
      "tutors" = 'yes'::"YesNoUnknown",
      "printer" = 'yes'::"YesNoUnknown",
      "noiselvl" = '3'::"NoiseLevel",
      "foodAllowed" = 'no'::"YesNoUnknown",
      "majors" = ARRAY['Engineering', 'Bio', 'Math']::"Major"[],
      "seating" = 'yes'::"YesNoUnknown",
      "computers" = 'yes'::"YesNoUnknown"
    WHERE "location" = ${location}
  `;
}
