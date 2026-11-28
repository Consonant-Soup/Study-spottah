-- CreateEnum
CREATE TYPE "Coverage" AS ENUM ('INDOOR', 'OUTDOOR', 'OUTDOOR_COVERED');

-- Add new columns with defaults so existing rows survive
ALTER TABLE "Spot" ADD COLUMN "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Spot" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Spot" ADD COLUMN "coverage" "Coverage" NOT NULL DEFAULT 'INDOOR';

-- Backfill name from location for existing rows
UPDATE "Spot" SET "name" = "location" WHERE "name" = '';

-- Make location optional
ALTER TABLE "Spot" ALTER COLUMN "location" DROP NOT NULL;

-- Remove the default on name (it was only for the migration)
ALTER TABLE "Spot" ALTER COLUMN "name" DROP DEFAULT;

-- Add new optional amenity columns
ALTER TABLE "Spot" ADD COLUMN "whiteboard" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "projector" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "chalkboard" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "freePaper" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "largeFormatPrinter" "YesNoUnknown" NOT NULL DEFAULT 'unknown';

-- Add adjacency columns
ALTER TABLE "Spot" ADD COLUMN "nearBathroom" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "nearWaterFountain" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "nearVendingMachine" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "nearFoodStore" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "nearBusStop" "YesNoUnknown" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Spot" ADD COLUMN "nearShuttle" "YesNoUnknown" NOT NULL DEFAULT 'unknown';

-- Add image and comments
ALTER TABLE "Spot" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Spot" ADD COLUMN "comments" TEXT;

-- Drop old columns
ALTER TABLE "Spot" DROP COLUMN "outdoors";
ALTER TABLE "Spot" DROP COLUMN "majors";
ALTER TABLE "Spot" DROP COLUMN "seating";

-- Update any rows using noise levels 6 or 7 to level 5 before removing those values
UPDATE "Spot" SET "noiselvl" = '5' WHERE "noiselvl" IN ('6', '7');

-- Remove old NoiseLevel enum values (6 and 7)
-- Postgres requires recreating the enum to remove values
ALTER TYPE "NoiseLevel" RENAME TO "NoiseLevel_old";
CREATE TYPE "NoiseLevel" AS ENUM ('1', '2', '3', '4', '5');
ALTER TABLE "Spot" ALTER COLUMN "noiselvl" TYPE "NoiseLevel" USING ("noiselvl"::text::"NoiseLevel");
DROP TYPE "NoiseLevel_old";

-- Drop the Major enum (no longer used)
DROP TYPE "Major";
