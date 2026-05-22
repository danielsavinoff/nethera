/*
  Warnings:

  - You are about to drop the column `amount_due_minor` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `amount_paid_minor` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount_minor` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "amount_due_minor",
ADD COLUMN     "amount_paid_minor" INTEGER NOT NULL,
ADD COLUMN     "total_amount_minor" INTEGER NOT NULL;
