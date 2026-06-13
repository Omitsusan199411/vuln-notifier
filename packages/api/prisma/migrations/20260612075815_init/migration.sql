-- CreateEnum
CREATE TYPE "severity" AS ENUM ('unknown', 'low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "batch_trigger_type" AS ENUM ('scheduled', 'manual');

-- CreateEnum
CREATE TYPE "batch_status" AS ENUM ('pending', 'running', 'success', 'failed');

-- CreateEnum
CREATE TYPE "notification_channel_type" AS ENUM ('line');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "cognito_sub" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecosystems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ecosystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerability_configs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ecosystem_id" TEXT NOT NULL,
    "min_severity" "severity" NOT NULL DEFAULT 'high',
    "min_cvss_score" DECIMAL(3,1) NOT NULL DEFAULT 7.0,
    "published_lookback_days" INTEGER NOT NULL DEFAULT 30,
    "max_fetch_count" INTEGER NOT NULL DEFAULT 10,
    "published_order_by" TEXT NOT NULL DEFAULT 'desc',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vulnerability_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerabilities" (
    "id" TEXT NOT NULL,
    "ghsa_id" TEXT NOT NULL,
    "cve_id" TEXT NOT NULL,
    "ecosystem_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "package_name" TEXT NOT NULL,
    "severity" "severity",
    "cvss_score" DECIMAL(3,1) NOT NULL,
    "summary" TEXT,
    "llm_summary" TEXT,
    "advisory_url" TEXT,
    "published_at" TIMESTAMP(3),
    "github_advisory_response" JSONB NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_cognito_sub_key" ON "users"("cognito_sub");

-- CreateIndex
CREATE UNIQUE INDEX "ecosystems_name_key" ON "ecosystems"("name");

-- CreateIndex
CREATE INDEX "vulnerability_configs_user_id_updated_at_idx" ON "vulnerability_configs"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "vulnerability_configs_updated_at_idx" ON "vulnerability_configs"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "vulnerability_configs_user_id_ecosystem_id_key" ON "vulnerability_configs"("user_id", "ecosystem_id");

-- CreateIndex
CREATE INDEX "vulnerabilities_updated_at_idx" ON "vulnerabilities"("updated_at");

-- CreateIndex
CREATE INDEX "vulnerabilities_batch_id_idx" ON "vulnerabilities"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "vulnerabilities_ghsa_id_ecosystem_id_package_name_key" ON "vulnerabilities"("ghsa_id", "ecosystem_id", "package_name");

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

-- AddForeignKey
ALTER TABLE "vulnerability_configs" ADD CONSTRAINT "vulnerability_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerability_configs" ADD CONSTRAINT "vulnerability_configs_ecosystem_id_fkey" FOREIGN KEY ("ecosystem_id") REFERENCES "ecosystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
