CREATE TYPE "MeetingStatus" AS ENUM ('scheduled', 'cancelled');
CREATE TYPE "MeetingResponse" AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "spotId" INTEGER NOT NULL,
    "convenerProfileId" INTEGER NOT NULL,
    "startAt" TIMESTAMPTZ(3) NOT NULL,
    "endAt" TIMESTAMPTZ(3) NOT NULL,
    "timeZone" TEXT NOT NULL,
    "status" "MeetingStatus" NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MeetingParticipant" (
    "meetingId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "response" "MeetingResponse" NOT NULL DEFAULT 'pending',
    "reminderSentAt" TIMESTAMPTZ(3),
    "reminderClaimedAt" TIMESTAMPTZ(3),

    CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("meetingId", "profileId")
);

CREATE INDEX "Meeting_startAt_status_idx" ON "Meeting"("startAt", "status");
CREATE INDEX "Meeting_convenerProfileId_idx" ON "Meeting"("convenerProfileId");
CREATE INDEX "MeetingParticipant_profileId_response_idx" ON "MeetingParticipant"("profileId", "response");

ALTER TABLE "Meeting"
    ADD CONSTRAINT "Meeting_spotId_fkey"
    FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Meeting"
    ADD CONSTRAINT "Meeting_convenerProfileId_fkey"
    FOREIGN KEY ("convenerProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MeetingParticipant"
    ADD CONSTRAINT "MeetingParticipant_meetingId_fkey"
    FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MeetingParticipant"
    ADD CONSTRAINT "MeetingParticipant_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
