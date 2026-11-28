-- CreateEnum
CREATE TYPE "SpotStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Add status column, default existing rows to APPROVED (they were already in the DB)
ALTER TABLE "Spot" ADD COLUMN "status" "SpotStatus" NOT NULL DEFAULT 'APPROVED';

-- New submissions will default to PENDING (handled by Prisma schema default)
