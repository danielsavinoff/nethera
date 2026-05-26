-- Rename money currency columns without losing existing values.
ALTER TABLE "payments" RENAME COLUMN "currency" TO "currency_code";
ALTER TABLE "invoices" RENAME COLUMN "currency" TO "currency_code";
ALTER TABLE "subscription_plan_prices" RENAME COLUMN "currency" TO "currency_code";

-- Subscription plan prices are selected by currency now, not locale.
DROP INDEX "subscription_plan_prices_subscription_plan_id_locale_key";
DROP INDEX "subscription_plan_prices_locale_idx";

ALTER TABLE "subscription_plan_prices" DROP COLUMN "locale";

CREATE INDEX "subscription_plan_prices_currency_code_idx" ON "subscription_plan_prices"("currency_code");
CREATE UNIQUE INDEX "subscription_plan_prices_subscription_plan_id_currency_code_key" ON "subscription_plan_prices"("subscription_plan_id", "currency_code") WHERE ("is_active" = true);
