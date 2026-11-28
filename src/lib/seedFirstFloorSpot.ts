import type { PrismaClient } from '@prisma/client';

export async function seedFirstFloorSpot(prisma: Pick<PrismaClient, '$executeRaw'>) {
  const name = 'First Floor, Hamilton Library';
  const location = 'Hamilton Library';

  await prisma.$executeRaw`
    INSERT INTO "Spot" (
      "name",
      "location",
      "coverage",
      "outlets",
      "foodAllowed",
      "microwave",
      "groupstudy",
      "ac",
      "printer",
      "computers",
      "whiteboard",
      "projector",
      "chalkboard",
      "windows",
      "tutors",
      "freePaper",
      "largeFormatPrinter",
      "nearBathroom",
      "nearWaterFountain",
      "nearVendingMachine",
      "nearFoodStore",
      "nearBusStop",
      "nearShuttle",
      "noiselvl"
    )
    SELECT
      ${name},
      ${location},
      'INDOOR'::"Coverage",
      'yes'::"YesNoUnknown",
      'no'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'yes'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      'unknown'::"YesNoUnknown",
      '3'::"NoiseLevel"
    WHERE NOT EXISTS (
      SELECT 1 FROM "Spot" WHERE "name" = ${name}
    )
  `;

  await prisma.$executeRaw`
    UPDATE "Spot"
    SET
      "location" = ${location},
      "coverage" = 'INDOOR'::"Coverage",
      "outlets" = 'yes'::"YesNoUnknown",
      "foodAllowed" = 'no'::"YesNoUnknown",
      "microwave" = 'unknown'::"YesNoUnknown",
      "groupstudy" = 'yes'::"YesNoUnknown",
      "ac" = 'yes'::"YesNoUnknown",
      "printer" = 'yes'::"YesNoUnknown",
      "computers" = 'yes'::"YesNoUnknown",
      "windows" = 'yes'::"YesNoUnknown",
      "tutors" = 'yes'::"YesNoUnknown",
      "noiselvl" = '3'::"NoiseLevel"
    WHERE "name" = ${name}
  `;
}
