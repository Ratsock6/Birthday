-- CreateTable
CREATE TABLE "KillerParticipant" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "KillerParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KillerParticipant_gameId_userId_key" ON "KillerParticipant"("gameId", "userId");

-- AddForeignKey
ALTER TABLE "KillerParticipant" ADD CONSTRAINT "KillerParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "KillerGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KillerParticipant" ADD CONSTRAINT "KillerParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
