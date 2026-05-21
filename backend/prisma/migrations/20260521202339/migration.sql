/*
  Warnings:

  - You are about to drop the `payment_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_subscriptions" DROP CONSTRAINT "payment_subscriptions_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_subscriptions" DROP CONSTRAINT "payment_subscriptions_subscription_id_fkey";

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "id" DROP DEFAULT;

-- DropTable
DROP TABLE "payment_subscriptions";

-- CreateTable
CREATE TABLE "invoice_subscriptions" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,

    CONSTRAINT "invoice_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invoice_subscriptions_invoice_id_idx" ON "invoice_subscriptions"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_subscriptions_subscription_id_idx" ON "invoice_subscriptions"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_subscriptions_invoice_id_subscription_id_key" ON "invoice_subscriptions"("invoice_id", "subscription_id");

-- AddForeignKey
ALTER TABLE "invoice_subscriptions" ADD CONSTRAINT "invoice_subscriptions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
