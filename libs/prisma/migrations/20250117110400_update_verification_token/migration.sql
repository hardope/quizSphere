-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EmailVerification', 'PasswordReset');

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'EmailVerification';
