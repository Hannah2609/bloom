/*
  Warnings:

  - You are about to drop the column `resetExpires` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetExpires",
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
