-- CreateEnum
CREATE TYPE "Standing" AS ENUM ('freshmen', 'sophmore', 'junior', 'senior', 'graduate', 'phd');

-- CreateEnum
CREATE TYPE "YesNoUnknown" AS ENUM ('yes', 'no', 'unknown');

-- CreateEnum
CREATE TYPE "NoiseLevel" AS ENUM ('1', '2', '3', '4', '5', '6', '7');

-- CreateEnum
CREATE TYPE "Major" AS ENUM ('Engineering', 'Bio', 'Math');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "profilepic" TEXT,
    "uhemail" TEXT NOT NULL,
    "uhstudentid" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "standing" "Standing" NOT NULL DEFAULT 'freshmen',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "outdoors" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "ac" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "microwave" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "outlets" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "windows" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "groupstudy" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "tutors" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "printer" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "noiselvl" "NoiseLevel" NOT NULL,
    "foodAllowed" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "majors" "Major"[],
    "seating" "YesNoUnknown" NOT NULL DEFAULT 'unknown',
    "computers" "YesNoUnknown" NOT NULL DEFAULT 'unknown',

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_uhemail_key" ON "Profile"("uhemail");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_uhstudentid_key" ON "Profile"("uhstudentid");
