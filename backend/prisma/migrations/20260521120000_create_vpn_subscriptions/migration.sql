CREATE TABLE "vpn_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "subscription_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vpn_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vpn_subscriptions_user_id_key" ON "vpn_subscriptions"("user_id");

CREATE UNIQUE INDEX "vpn_subscriptions_provider_external_id_key" ON "vpn_subscriptions"("provider", "external_id");

ALTER TABLE "vpn_subscriptions" ADD CONSTRAINT "vpn_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
