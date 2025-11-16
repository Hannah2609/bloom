/*
  Warnings:

  - You are about to drop the column `createdAt` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TeamMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,userId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leftAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");
