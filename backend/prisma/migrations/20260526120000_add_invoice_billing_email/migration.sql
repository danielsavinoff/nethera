ALTER TABLE "invoices" ADD COLUMN "billing_email" VARCHAR(255);

UPDATE "invoices"
SET "billing_email" = "users"."email"
FROM "users"
WHERE "invoices"."user_id" = "users"."id";

ALTER TABLE "invoices" ALTER COLUMN "billing_email" SET NOT NULL;
