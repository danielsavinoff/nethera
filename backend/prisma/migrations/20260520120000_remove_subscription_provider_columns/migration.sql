DROP INDEX IF EXISTS "subscriptions_provider_provider_subscription_id_key";

ALTER TABLE "subscriptions"
  DROP COLUMN IF EXISTS "provider",
  DROP COLUMN IF EXISTS "provider_customer_id",
  DROP COLUMN IF EXISTS "provider_subscription_id";
