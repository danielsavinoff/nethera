ALTER TABLE "users" RENAME COLUMN "is_active" TO "is_deleted";

UPDATE "users" SET "is_deleted" = NOT "is_deleted";

ALTER TABLE "users" ALTER COLUMN "is_deleted" SET DEFAULT false;

DROP INDEX IF EXISTS "users_email_key";

CREATE UNIQUE INDEX "users_email_key" ON "users"("email") WHERE ("is_deleted" = false);
