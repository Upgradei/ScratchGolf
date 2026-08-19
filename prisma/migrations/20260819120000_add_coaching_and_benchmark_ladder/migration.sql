-- Add the coaching/technique layer and the structured benchmark ladder that
-- lib/rank.ts consumes to tell the player what tier they're performing at.

-- AlterTable
ALTER TABLE "Drill" ADD COLUMN "coaching" TEXT;
ALTER TABLE "Drill" ADD COLUMN "higherIsBetter" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Drill" ADD COLUMN "benchmarks" JSONB;
