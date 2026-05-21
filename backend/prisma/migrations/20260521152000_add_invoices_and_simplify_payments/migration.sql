CREATE TABLE "invoices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "external_id" VARCHAR(255) NOT NULL,
  "provider" VARCHAR(32) NOT NULL,
  "user_id" UUID NOT NULL,
  "status" VARCHAR(32) NOT NULL,
  "amount_due_minor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "external_checkout_url" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

INSERT INTO "invoices" (
  "external_id",
  "provider",
  "user_id",
  "status",
  "amount_due_minor",
  "currency",
  "external_checkout_url",
  "created_at",
  "updated_at"
)
SELECT
  "external_id",
  "provider",
  "user_id",
  CASE
    WHEN "status" = 'paid' THEN 'paid'
    WHEN "status" = 'void' THEN 'canceled'
    WHEN "status" = 'failed' THEN 'expired'
    ELSE 'pending'
  END,
  "amount_due_minor",
  "currency",
  "provider_payment_url",
  "created_at",
  "updated_at"
FROM "payments";

ALTER TABLE "payments" ADD COLUMN "amount_minor" INTEGER;

UPDATE "payments"
SET "amount_minor" = "amount_due_minor";

ALTER TABLE "payments" ALTER COLUMN "amount_minor" SET NOT NULL;
ALTER TABLE "payments" DROP COLUMN "amount_due_minor";
ALTER TABLE "payments" DROP COLUMN "amount_paid_minor";
ALTER TABLE "payments" DROP COLUMN "provider_payment_url";

CREATE UNIQUE INDEX "invoices_provider_external_id_key" ON "invoices"("provider", "external_id");
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
