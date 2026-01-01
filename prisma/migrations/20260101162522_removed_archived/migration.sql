/*
  Warnings:

  - The values [ARCHIVED] on the enum `SurveyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SurveyStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');
ALTER TABLE "public"."Survey" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Survey" ALTER COLUMN "status" TYPE "SurveyStatus_new" USING ("status"::text::"SurveyStatus_new");
ALTER TYPE "SurveyStatus" RENAME TO "SurveyStatus_old";
ALTER TYPE "SurveyStatus_new" RENAME TO "SurveyStatus";
DROP TYPE "public"."SurveyStatus_old";
ALTER TABLE "Survey" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
