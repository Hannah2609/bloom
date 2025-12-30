-- CreateTable
CREATE TABLE "HappinessScoreSubmission" (
    "id" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HappinessScoreSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HappinessScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "HappinessScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HappinessScoreSubmission_userId_idx" ON "HappinessScoreSubmission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HappinessScoreSubmission_userId_weekStartDate_key" ON "HappinessScoreSubmission"("userId", "weekStartDate");

-- CreateIndex
CREATE INDEX "HappinessScore_companyId_weekStartDate_idx" ON "HappinessScore"("companyId", "weekStartDate");

-- CreateIndex
CREATE INDEX "HappinessScore_teamId_weekStartDate_idx" ON "HappinessScore"("teamId", "weekStartDate");

-- AddForeignKey
ALTER TABLE "HappinessScoreSubmission" ADD CONSTRAINT "HappinessScoreSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HappinessScore" ADD CONSTRAINT "HappinessScore_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HappinessScore" ADD CONSTRAINT "HappinessScore_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
