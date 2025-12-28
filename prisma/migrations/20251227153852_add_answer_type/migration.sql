-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('SATISFACTION', 'AGREEMENT', 'SCALE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answerType" "AnswerType" NOT NULL DEFAULT 'SCALE';
