/*
  Warnings:

  - The values [freshmen,graduate] on the enum `Standing` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `uhstudentid` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Standing_new" AS ENUM ('freshman', 'sophmore', 'junior', 'senior', 'masters', 'phd');
ALTER TABLE "public"."Profile" ALTER COLUMN "standing" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "standing" TYPE "Standing_new" USING ("standing"::text::"Standing_new");
ALTER TYPE "Standing" RENAME TO "Standing_old";
ALTER TYPE "Standing_new" RENAME TO "Standing";
DROP TYPE "public"."Standing_old";
ALTER TABLE "Profile" ALTER COLUMN "standing" SET DEFAULT 'freshman';
COMMIT;

-- DropIndex
DROP INDEX "Profile_uhstudentid_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "uhstudentid",
ADD COLUMN     "username" TEXT,
ALTER COLUMN "standing" SET DEFAULT 'freshman';

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
