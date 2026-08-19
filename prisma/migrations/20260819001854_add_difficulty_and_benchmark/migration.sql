-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Drill" ADD COLUMN "difficultyLevel" "DifficultyLevel" NOT NULL;
ALTER TABLE "Drill" ADD COLUMN "benchmarkNote" TEXT;
