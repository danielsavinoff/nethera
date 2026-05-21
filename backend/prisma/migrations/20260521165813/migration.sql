-- AlterTable
ALTER TABLE "payment_subscriptions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payments" RENAME CONSTRAINT "subscription_invoices_pkey" TO "payments_pkey";

-- AlterTable
ALTER TABLE "subscription_plan_feature_translations" RENAME CONSTRAINT "plan_feature_translations_pkey" TO "subscription_plan_feature_translations_pkey";

-- AlterTable
ALTER TABLE "subscription_plan_features" RENAME CONSTRAINT "plan_features_pkey" TO "subscription_plan_features_pkey";

-- AlterTable
ALTER TABLE "subscription_plan_translations" RENAME CONSTRAINT "plan_translations_pkey" TO "subscription_plan_translations_pkey";

-- AlterTable
ALTER TABLE "subscription_plans" RENAME CONSTRAINT "plans_pkey" TO "subscription_plans_pkey";

-- AlterTable
ALTER TABLE "subscription_prices" ALTER COLUMN "id" DROP DEFAULT;

-- RenameForeignKey
ALTER TABLE "subscription_plan_feature_translations" RENAME CONSTRAINT "subscription_plan_feature_translations_subscription_plan_featur" TO "subscription_plan_feature_translations_subscription_plan_f_fkey";

-- RenameIndex
ALTER INDEX "subscription_plan_feature_translations_subscription_plan_featur" RENAME TO "subscription_plan_feature_translations_subscription_plan_fe_key";

-- RenameIndex
ALTER INDEX "subscription_plan_translations_subscription_plan_id_language_ke" RENAME TO "subscription_plan_translations_subscription_plan_id_languag_key";

-- RenameIndex
ALTER INDEX "subscription_prices_subscription_plan_id_country_code_active_ke" RENAME TO "subscription_prices_subscription_plan_id_country_code_key";
