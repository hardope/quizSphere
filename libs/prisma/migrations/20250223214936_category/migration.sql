-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "category" TEXT DEFAULT 'general',
ALTER COLUMN "timeLimit" SET DEFAULT 300;
