/*
  Warnings:

  - You are about to drop the column `cancel_at_period_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_end_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_start_at` on the `subscriptions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscriptions_current_period_end_at_idx";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancel_at_period_end",
DROP COLUMN "current_period_end_at",
DROP COLUMN "current_period_start_at",
ADD COLUMN     "expires_at" TIMESTAMPTZ,
ALTER COLUMN "auto_renew" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "subscriptions_expires_at_idx" ON "subscriptions"("expires_at");
