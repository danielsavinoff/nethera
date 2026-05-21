-- Drop old constraints and indexes before renaming/dropping columns.
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_plan_id_fkey";
ALTER TABLE "subscription_invoices" DROP CONSTRAINT IF EXISTS "subscription_invoices_subscription_id_fkey";
ALTER TABLE "subscription_invoices" DROP CONSTRAINT IF EXISTS "subscription_invoices_user_id_fkey";
ALTER TABLE "plan_translations" DROP CONSTRAINT IF EXISTS "plan_translations_plan_id_fkey";
ALTER TABLE "plan_features" DROP CONSTRAINT IF EXISTS "plan_features_plan_id_fkey";
ALTER TABLE "plan_feature_translations" DROP CONSTRAINT IF EXISTS "plan_feature_translations_plan_feature_id_fkey";

DROP INDEX IF EXISTS "subscriptions_plan_id_idx";
DROP INDEX IF EXISTS "subscription_invoices_subscription_id_idx";
DROP INDEX IF EXISTS "subscription_invoices_user_id_idx";
DROP INDEX IF EXISTS "subscription_invoices_status_idx";
DROP INDEX IF EXISTS "subscription_invoices_provider_provider_invoice_id_key";
DROP INDEX IF EXISTS "plan_translations_language_idx";
DROP INDEX IF EXISTS "plan_translations_plan_id_language_key";
DROP INDEX IF EXISTS "plan_features_plan_id_idx";
DROP INDEX IF EXISTS "plan_features_sort_order_idx";
DROP INDEX IF EXISTS "plan_features_plan_id_code_key";
DROP INDEX IF EXISTS "plan_feature_translations_language_idx";
DROP INDEX IF EXISTS "plan_feature_translations_plan_feature_id_language_key";
DROP INDEX IF EXISTS "plans_code_key";
DROP INDEX IF EXISTS "plans_is_active_idx";

-- Rename subscription plan tables and columns.
ALTER TABLE "plans" RENAME TO "subscription_plans";
ALTER TABLE "plan_translations" RENAME TO "subscription_plan_translations";
ALTER TABLE "plan_features" RENAME TO "subscription_plan_features";
ALTER TABLE "plan_feature_translations" RENAME TO "subscription_plan_feature_translations";

ALTER TABLE "subscriptions" RENAME COLUMN "plan_id" TO "subscription_plan_id";
ALTER TABLE "subscription_plan_translations" RENAME COLUMN "plan_id" TO "subscription_plan_id";
ALTER TABLE "subscription_plan_features" RENAME COLUMN "plan_id" TO "subscription_plan_id";
ALTER TABLE "subscription_plan_feature_translations" RENAME COLUMN "plan_feature_id" TO "subscription_plan_feature_id";

-- Move plan prices into their own table.
CREATE TABLE "subscription_prices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "subscription_plan_id" UUID NOT NULL,
  "amount_minor" INTEGER NOT NULL,
  "currency" CHAR(3) NOT NULL,
  "country_code" CHAR(2) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscription_prices_pkey" PRIMARY KEY ("id")
);

INSERT INTO "subscription_prices" (
  "subscription_plan_id",
  "amount_minor",
  "currency",
  "country_code",
  "is_active",
  "created_at"
)
SELECT
  "id",
  ROUND("price_amount" * 100)::INTEGER,
  "price_currency",
  'US',
  true,
  "created_at"
FROM "subscription_plans";

ALTER TABLE "subscription_plans" DROP COLUMN "price_amount";
ALTER TABLE "subscription_plans" DROP COLUMN "price_currency";

-- Rename invoices to payments and normalize provider/payment fields.
ALTER TABLE "subscription_invoices" RENAME TO "payments";

CREATE TABLE "payment_subscriptions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "payment_id" UUID NOT NULL,
  "subscription_id" UUID NOT NULL,
  CONSTRAINT "payment_subscriptions_pkey" PRIMARY KEY ("id")
);

INSERT INTO "payment_subscriptions" ("payment_id", "subscription_id")
SELECT "id", "subscription_id"
FROM "payments";

ALTER TABLE "payments" ADD COLUMN "amount_due_minor" INTEGER;
ALTER TABLE "payments" ADD COLUMN "amount_paid_minor" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "external_id" VARCHAR(255);
ALTER TABLE "payments" ADD COLUMN "provider_payment_url" TEXT;

UPDATE "payments"
SET
  "amount_due_minor" = ROUND("amount_due" * 100)::INTEGER,
  "amount_paid_minor" = ROUND("amount_paid" * 100)::INTEGER,
  "provider" = COALESCE("provider", 'unknown'),
  "external_id" = COALESCE("provider_invoice_id", "id"::TEXT),
  "provider_payment_url" = COALESCE("checkout_url", '');

ALTER TABLE "payments" ALTER COLUMN "amount_due_minor" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "provider" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "external_id" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "provider_payment_url" SET NOT NULL;

ALTER TABLE "payments" DROP COLUMN "subscription_id";
ALTER TABLE "payments" DROP COLUMN "amount_due";
ALTER TABLE "payments" DROP COLUMN "amount_paid";
ALTER TABLE "payments" DROP COLUMN "period_start_at";
ALTER TABLE "payments" DROP COLUMN "period_end_at";
ALTER TABLE "payments" DROP COLUMN "issued_at";
ALTER TABLE "payments" DROP COLUMN "provider_invoice_id";
ALTER TABLE "payments" DROP COLUMN "provider_payment_intent_id";
ALTER TABLE "payments" DROP COLUMN "checkout_url";

-- Recreate indexes and foreign keys under the new names.
CREATE INDEX "subscriptions_subscription_plan_id_idx" ON "subscriptions"("subscription_plan_id");
CREATE UNIQUE INDEX "subscription_plans_code_key" ON "subscription_plans"("code");
CREATE INDEX "subscription_plans_is_active_idx" ON "subscription_plans"("is_active");
CREATE INDEX "subscription_plan_translations_language_idx" ON "subscription_plan_translations"("language");
CREATE UNIQUE INDEX "subscription_plan_translations_subscription_plan_id_language_key" ON "subscription_plan_translations"("subscription_plan_id", "language");
CREATE INDEX "subscription_plan_features_subscription_plan_id_idx" ON "subscription_plan_features"("subscription_plan_id");
CREATE INDEX "subscription_plan_features_sort_order_idx" ON "subscription_plan_features"("sort_order");
CREATE UNIQUE INDEX "subscription_plan_features_subscription_plan_id_code_key" ON "subscription_plan_features"("subscription_plan_id", "code");
CREATE INDEX "subscription_plan_feature_translations_language_idx" ON "subscription_plan_feature_translations"("language");
CREATE UNIQUE INDEX "subscription_plan_feature_translations_subscription_plan_feature_id_language_key" ON "subscription_plan_feature_translations"("subscription_plan_feature_id", "language");
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");
CREATE UNIQUE INDEX "payments_provider_external_id_key" ON "payments"("provider", "external_id");
CREATE INDEX "payment_subscriptions_payment_id_idx" ON "payment_subscriptions"("payment_id");
CREATE INDEX "payment_subscriptions_subscription_id_idx" ON "payment_subscriptions"("subscription_id");
CREATE UNIQUE INDEX "payment_subscriptions_payment_id_subscription_id_key" ON "payment_subscriptions"("payment_id", "subscription_id");
CREATE INDEX "subscription_prices_subscription_plan_id_idx" ON "subscription_prices"("subscription_plan_id");
CREATE INDEX "subscription_prices_country_code_idx" ON "subscription_prices"("country_code");
CREATE UNIQUE INDEX "subscription_prices_subscription_plan_id_country_code_active_key" ON "subscription_prices"("subscription_plan_id", "country_code") WHERE "is_active" = true;

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscription_plan_translations" ADD CONSTRAINT "subscription_plan_translations_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "subscription_plan_features_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscription_plan_feature_translations" ADD CONSTRAINT "subscription_plan_feature_translations_subscription_plan_feature_id_fkey" FOREIGN KEY ("subscription_plan_feature_id") REFERENCES "subscription_plan_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_subscriptions" ADD CONSTRAINT "payment_subscriptions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payment_subscriptions" ADD CONSTRAINT "payment_subscriptions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscription_prices" ADD CONSTRAINT "subscription_prices_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
