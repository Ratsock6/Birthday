/*
  Warnings:

  - You are about to drop the column `missionDesc` on the `KillerAssignment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EliminationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "KillerAssignment" DROP COLUMN "missionDesc",
ADD COLUMN     "missionId" TEXT;

-- AlterTable
ALTER TABLE "KillerGame" ADD COLUMN     "showLeaderboard" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "KillerMission" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "KillerMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EliminationRequest" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "killerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "EliminationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "EliminationRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KillerAssignment" ADD CONSTRAINT "KillerAssignment_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "KillerMission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EliminationRequest" ADD CONSTRAINT "EliminationRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "KillerGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
