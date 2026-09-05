-- CreateEnum
CREATE TYPE "severity" AS ENUM ('unknown', 'low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "batch_trigger_type" AS ENUM ('scheduled', 'manual');

-- CreateEnum
CREATE TYPE "batch_status" AS ENUM ('pending', 'running', 'success', 'failed');

-- CreateEnum
CREATE TYPE "notification_channel_type" AS ENUM ('line');

-- CreateEnum
CREATE TYPE "advisory_source" AS ENUM ('github');

-- CreateEnum
CREATE TYPE "ecosystem_name" AS ENUM ('rubygems', 'npm', 'pip', 'maven', 'nuget', 'composer', 'go', 'rust', 'erlang', 'actions', 'pub', 'other', 'swift');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'general');

-- CreateEnum
CREATE TYPE "sort_order" AS ENUM ('desc', 'asc');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "cognito_sub" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecosystems" (
    "id" TEXT NOT NULL,
    "name" "ecosystem_name" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ecosystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerabilities" (
    "id" TEXT NOT NULL,
    "source_advisory_id" TEXT NOT NULL,
    "advisory_source" "advisory_source" NOT NULL,
    "cve_id" TEXT NOT NULL,
    "ecosystem_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "package_name" TEXT NOT NULL,
    "severity" "severity" NOT NULL,
    "cvss_score" DOUBLE PRECISION,
    "summary" TEXT NOT NULL,
    "llm_summary" TEXT,
    "advisory_url" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "source_updated_at" TIMESTAMP(3) NOT NULL,
    "source_response" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vulnerabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "trigger_type" "batch_trigger_type" NOT NULL,
    "triggered_by" TEXT,
    "executed_at" TIMESTAMP(3) NOT NULL,
    "status" "batch_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_channels" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "notification_channel_type" NOT NULL,
    "max_notification_limit" INTEGER NOT NULL DEFAULT 10,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "min_severity" "severity" NOT NULL DEFAULT 'high',
    "min_cvss_score" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
    "cvss_score_order_by" "sort_order" NOT NULL DEFAULT 'desc',
    "notification_interval_minutes" INTEGER NOT NULL DEFAULT 1440,
    "last_processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_channels" (
    "id" TEXT NOT NULL,
    "notification_channel_id" TEXT NOT NULL,
    "line_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "notification_channel_id" TEXT NOT NULL,
    "vulnerability_id" TEXT NOT NULL,
    "notified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_channel_ecosystems" (
    "id" TEXT NOT NULL,
    "notification_channel_id" TEXT NOT NULL,
    "ecosystem_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_channel_ecosystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_llm_token_usages" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "model_id" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_llm_token_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_llm_token_usages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "model_id" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_llm_token_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_llm_token_budgets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "monthly_token_budget" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_llm_token_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerability_auto_fetch_settings" (
    "id" TEXT NOT NULL,
    "interval_minutes" INTEGER NOT NULL DEFAULT 60,
    "max_fetch_count" INTEGER NOT NULL DEFAULT 100,
    "lookback_days" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vulnerability_auto_fetch_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerability_manual_fetch_settings" (
    "id" TEXT NOT NULL,
    "max_fetch_count" INTEGER NOT NULL DEFAULT 30,
    "max_lookback_days" INTEGER NOT NULL DEFAULT 1,
    "min_interval_minutes" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vulnerability_manual_fetch_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cognito_sub_key" ON "users"("cognito_sub");

-- CreateIndex
CREATE UNIQUE INDEX "ecosystems_name_key" ON "ecosystems"("name");

-- CreateIndex
CREATE INDEX "vulnerabilities_updated_at_idx" ON "vulnerabilities"("updated_at");

-- CreateIndex
CREATE INDEX "vulnerabilities_batch_id_idx" ON "vulnerabilities"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "vulnerabilities_source_advisory_id_ecosystem_id_package_nam_key" ON "vulnerabilities"("source_advisory_id", "ecosystem_id", "package_name");

-- CreateIndex
CREATE INDEX "batches_trigger_type_executed_at_idx" ON "batches"("trigger_type", "executed_at");

-- CreateIndex
CREATE INDEX "batches_triggered_by_executed_at_idx" ON "batches"("triggered_by", "executed_at");

-- CreateIndex
CREATE INDEX "batches_status_idx" ON "batches"("status");

-- CreateIndex
CREATE INDEX "notification_channels_user_id_enabled_idx" ON "notification_channels"("user_id", "enabled");

-- CreateIndex
CREATE UNIQUE INDEX "line_channels_notification_channel_id_key" ON "line_channels"("notification_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "line_channels_line_user_id_key" ON "line_channels"("line_user_id");

-- CreateIndex
CREATE INDEX "notifications_notified_at_idx" ON "notifications"("notified_at");

-- CreateIndex
CREATE INDEX "notifications_notification_channel_id_created_at_idx" ON "notifications"("notification_channel_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_channel_ecosystems_notification_channel_id_eco_key" ON "notification_channel_ecosystems"("notification_channel_id", "ecosystem_id");

-- CreateIndex
CREATE UNIQUE INDEX "llm_models_name_key" ON "llm_models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "app_llm_token_usages_model_id_year_month_key" ON "app_llm_token_usages"("model_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "user_llm_token_usages_user_id_model_id_year_month_key" ON "user_llm_token_usages"("user_id", "model_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "user_llm_token_budgets_user_id_key" ON "user_llm_token_budgets"("user_id");

-- AddForeignKey
ALTER TABLE "vulnerabilities" ADD CONSTRAINT "vulnerabilities_ecosystem_id_fkey" FOREIGN KEY ("ecosystem_id") REFERENCES "ecosystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerabilities" ADD CONSTRAINT "vulnerabilities_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_triggered_by_fkey" FOREIGN KEY ("triggered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_channels" ADD CONSTRAINT "notification_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_channels" ADD CONSTRAINT "line_channels_notification_channel_id_fkey" FOREIGN KEY ("notification_channel_id") REFERENCES "notification_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_channel_id_fkey" FOREIGN KEY ("notification_channel_id") REFERENCES "notification_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_vulnerability_id_fkey" FOREIGN KEY ("vulnerability_id") REFERENCES "vulnerabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_channel_ecosystems" ADD CONSTRAINT "notification_channel_ecosystems_notification_channel_id_fkey" FOREIGN KEY ("notification_channel_id") REFERENCES "notification_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_channel_ecosystems" ADD CONSTRAINT "notification_channel_ecosystems_ecosystem_id_fkey" FOREIGN KEY ("ecosystem_id") REFERENCES "ecosystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_llm_token_usages" ADD CONSTRAINT "app_llm_token_usages_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "llm_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_llm_token_usages" ADD CONSTRAINT "user_llm_token_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_llm_token_usages" ADD CONSTRAINT "user_llm_token_usages_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "llm_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_llm_token_budgets" ADD CONSTRAINT "user_llm_token_budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
