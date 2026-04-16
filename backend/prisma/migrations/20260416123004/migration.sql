/*
  Warnings:

  - Added the required column `status` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "status" VARCHAR(64) NOT NULL;
