-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "locale" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "requested_ip" INET,
    "requested_user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "billing_interval" VARCHAR(16) NOT NULL,
    "billing_interval_count" INTEGER NOT NULL DEFAULT 1,
    "code" VARCHAR(64) NOT NULL,
    "trial_days" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMPTZ NOT NULL,
    "expires_at" TIMESTAMPTZ,
    "trial_started_at" TIMESTAMPTZ,
    "trial_ends_at" TIMESTAMPTZ,
    "canceled_at" TIMESTAMPTZ,
    "ended_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,
    "subscription_plan_id" UUID NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "failure_code" VARCHAR(64),
    "failure_message" TEXT,
    "metadata" JSONB,
    "due_at" TIMESTAMPTZ,
    "paid_at" TIMESTAMPTZ,
    "failed_at" TIMESTAMPTZ,
    "voided_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "total_amount_minor" INTEGER NOT NULL,
    "amount_paid_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "external_checkout_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "expires_at" TIMESTAMPTZ,
    "user_id" UUID NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "id" UUID NOT NULL,
    "reference_id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "amount" INTEGER NOT NULL,
    "invoice_id" UUID NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_prices" (
    "id" UUID NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscription_plan_id" UUID NOT NULL,

    CONSTRAINT "subscription_plan_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vpn_subscriptions" (
    "id" UUID NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "subscription_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "vpn_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_translations" (
    "id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "subscription_plan_id" UUID NOT NULL,

    CONSTRAINT "subscription_plan_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_features" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "value" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "subscription_plan_id" UUID NOT NULL,

    CONSTRAINT "subscription_plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_feature_translations" (
    "id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "subscription_plan_feature_id" UUID NOT NULL,

    CONSTRAINT "subscription_plan_feature_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_token_hash_key" ON "auth_tokens"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_code_key" ON "subscription_plans"("code");

-- CreateIndex
CREATE INDEX "subscription_plans_is_public_idx" ON "subscription_plans"("is_public");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_subscription_plan_id_idx" ON "subscriptions"("subscription_plan_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_expires_at_idx" ON "subscriptions"("expires_at");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_external_id_key" ON "payments"("provider", "external_id");

-- CreateIndex
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_provider_external_id_key" ON "invoices"("provider", "external_id");

-- CreateIndex
CREATE INDEX "invoice_lines_invoice_id_idx" ON "invoice_lines"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_lines_reference_id_type_key" ON "invoice_lines"("reference_id", "type");

-- CreateIndex
CREATE INDEX "subscription_plan_prices_subscription_plan_id_idx" ON "subscription_plan_prices"("subscription_plan_id");

-- CreateIndex
CREATE INDEX "subscription_plan_prices_locale_idx" ON "subscription_plan_prices"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_prices_subscription_plan_id_locale_key" ON "subscription_plan_prices"("subscription_plan_id", "locale") WHERE ("is_active" = true);

-- CreateIndex
CREATE UNIQUE INDEX "vpn_subscriptions_user_id_key" ON "vpn_subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vpn_subscriptions_provider_external_id_key" ON "vpn_subscriptions"("provider", "external_id");

-- CreateIndex
CREATE INDEX "subscription_plan_translations_locale_idx" ON "subscription_plan_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_translations_subscription_plan_id_locale_key" ON "subscription_plan_translations"("subscription_plan_id", "locale");

-- CreateIndex
CREATE INDEX "subscription_plan_features_subscription_plan_id_idx" ON "subscription_plan_features"("subscription_plan_id");

-- CreateIndex
CREATE INDEX "subscription_plan_features_sort_order_idx" ON "subscription_plan_features"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_features_subscription_plan_id_code_key" ON "subscription_plan_features"("subscription_plan_id", "code");

-- CreateIndex
CREATE INDEX "subscription_plan_feature_translations_locale_idx" ON "subscription_plan_feature_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_feature_translations_subscription_plan_fe_key" ON "subscription_plan_feature_translations"("subscription_plan_feature_id", "locale");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_prices" ADD CONSTRAINT "subscription_plan_prices_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vpn_subscriptions" ADD CONSTRAINT "vpn_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_translations" ADD CONSTRAINT "subscription_plan_translations_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "subscription_plan_features_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_feature_translations" ADD CONSTRAINT "subscription_plan_feature_translations_subscription_plan_f_fkey" FOREIGN KEY ("subscription_plan_feature_id") REFERENCES "subscription_plan_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
