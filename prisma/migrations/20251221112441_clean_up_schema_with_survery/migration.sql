/*
  Warnings:

  - You are about to drop the column `textAnswer` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isAnonymous` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnswerToQuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ratingValue` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "_AnswerToQuestionOption" DROP CONSTRAINT "_AnswerToQuestionOption_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnswerToQuestionOption" DROP CONSTRAINT "_AnswerToQuestionOption_B_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "textAnswer",
ADD COLUMN     "ratingValue" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type",
ALTER COLUMN "required" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "isAnonymous";

-- DropTable
DROP TABLE "QuestionOption";

-- DropTable
DROP TABLE "_AnswerToQuestionOption";

-- DropEnum
DROP TYPE "QuestionType";
