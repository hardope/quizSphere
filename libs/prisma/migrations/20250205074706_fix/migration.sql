-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "multipleAttempts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passingScore" DOUBLE PRECISION,
ADD COLUMN     "randomize" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showResultsImmediately" BOOLEAN NOT NULL DEFAULT false;
