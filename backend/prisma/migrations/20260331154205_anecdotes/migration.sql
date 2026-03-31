-- CreateTable
CREATE TABLE "Anecdote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isTrue" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anecdote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Anecdote" ADD CONSTRAINT "Anecdote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
