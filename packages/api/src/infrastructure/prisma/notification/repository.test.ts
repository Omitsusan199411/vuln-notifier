import { beforeEach, describe, expect, it } from "vitest";
import { Notification } from "@/domain/notification/entity.js";
import type { NewNotificationProps } from "@/domain/notification/entity.type.js";
import { PrismaNotificationRepository } from "@/infrastructure/prisma/notification/repository.js";
import { newNotificationPropsFactory } from "@/testing/factories/notification.js";
import { notificationFactory } from "@/testing/factories/persisted/notification.js";
import { notificationChannelFactory } from "@/testing/factories/persisted/notification-channel.js";
import { vulnerabilityFactory } from "@/testing/factories/persisted/vulnerability.js";

describe("Prisma Notification Repository Integration Test", () => {
	describe("fetchLatestByVulnerabilityIdsメソッド", () => {
		let repository: PrismaNotificationRepository;

		beforeEach(() => {
			repository = new PrismaNotificationRepository();
		});

		it("指定したvulnerabilityIdsのうち、通知済みのものについてvulnerabilityIdごとに最新の通知1件が返ること", async () => {
			const notificationChannelId = (await notificationChannelFactory.create())
				.id;
			const vulnerabilityId1 = (await vulnerabilityFactory.create()).id;
			const vulnerabilityId2 = (await vulnerabilityFactory.create()).id;

			const notifiedAts1 = [new Date("2026-01-01"), new Date("2026-01-03")];
			const notifiedAts2 = [new Date("2026-02-05"), new Date("2026-02-01")];

			for (const notifiedAt of notifiedAts1) {
				await notificationFactory.create({
					notificationChannelId,
					vulnerabilityId: vulnerabilityId1,
					notifiedAt,
				});
			}
			for (const notifiedAt of notifiedAts2) {
				await notificationFactory.create({
					notificationChannelId,
					vulnerabilityId: vulnerabilityId2,
					notifiedAt,
				});
			}

			const notifications = await repository.fetchLatestByVulnerabilityIds({
				notificationChannelId,
				vulnerabilityIds: [vulnerabilityId1, vulnerabilityId2],
			});

			const byVulnerabilityId = new Map(
				notifications.map((notification) => [
					notification.vulnerabilityId,
					notification,
				]),
			);

			expect(notifications).toHaveLength(2);
			expect(byVulnerabilityId.get(vulnerabilityId1)?.notifiedAt).toEqual(
				notifiedAts1.reduce((latestNotifiedAt, notifiedAt) =>
					notifiedAt > latestNotifiedAt ? notifiedAt : latestNotifiedAt,
				),
			);
			expect(byVulnerabilityId.get(vulnerabilityId2)?.notifiedAt).toEqual(
				notifiedAts2.reduce((latestNotifiedAt, notifiedAt) =>
					notifiedAt > latestNotifiedAt ? notifiedAt : latestNotifiedAt,
				),
			);
		});

		it("一度も通知していないvulnerabilityIdは結果に含まれないこと", async () => {
			const notificationChannelId = (await notificationChannelFactory.create())
				.id;
			const vulnerabilityId1 = (await vulnerabilityFactory.create()).id;
			const vulnerabilityId2 = (await vulnerabilityFactory.create()).id;

			const notifiedAts = [new Date("2026-01-01"), new Date("2026-01-02")];

			for (const notifiedAt of notifiedAts) {
				await notificationFactory.create({
					notifiedAt,
					notificationChannelId,
					vulnerabilityId: vulnerabilityId1,
				});
			}

			const notifications = await repository.fetchLatestByVulnerabilityIds({
				notificationChannelId,
				vulnerabilityIds: [vulnerabilityId1, vulnerabilityId2],
			});

			expect(notifications).toHaveLength(1);
			expect(
				notifications.every(
					(notification) => notification.vulnerabilityId === vulnerabilityId1,
				),
			).toBe(true);
			expect(
				notifications.some(
					(notification) => notification.vulnerabilityId === vulnerabilityId2,
				),
			).toBe(false);
		});

		it("vulnerabilityIdsに指定していないvulnerabilityIdの通知は結果に含まれないこと", async () => {
			const vulnerabilityId1 = (await vulnerabilityFactory.create()).id;
			const vulnerabilityId2 = (await vulnerabilityFactory.create()).id;

			const notifiedAts1 = [new Date("2026-01-01"), new Date("2026-01-03")];
			const notifiedAts2 = [new Date("2026-01-02"), new Date("2026-01-04")];

			const notificationChannelId = (await notificationChannelFactory.create())
				.id;

			for (const notifiedAt of notifiedAts1) {
				await notificationFactory.create({
					vulnerabilityId: vulnerabilityId1,
					notificationChannelId,
					notifiedAt,
				});
			}

			for (const notifiedAt of notifiedAts2) {
				await notificationFactory.create({
					vulnerabilityId: vulnerabilityId2,
					notificationChannelId,
					notifiedAt,
				});
			}

			const notifications = await repository.fetchLatestByVulnerabilityIds({
				notificationChannelId,
				vulnerabilityIds: [vulnerabilityId1],
			});

			expect(notifications).toHaveLength(1);
			expect(
				notifications.every(
					(notification) => notification.vulnerabilityId === vulnerabilityId1,
				),
			).toBe(true);
			expect(
				notifications.some(
					(notification) => notification.vulnerabilityId === vulnerabilityId2,
				),
			).toBe(false);
		});

		it("別チャネルの通知履歴は結果に含まれないこと", async () => {
			const notificationChannelId1 = (await notificationChannelFactory.create())
				.id;
			const notificationChannelId2 = (await notificationChannelFactory.create())
				.id;

			const vulnerabilityId = (await vulnerabilityFactory.create()).id;

			const notifiedAts = [new Date("2026-01-01"), new Date("2026-01-03")];

			for (const notifiedAt of notifiedAts) {
				await notificationFactory.create({
					vulnerabilityId,
					notificationChannelId: notificationChannelId1,
					notifiedAt,
				});
			}

			for (const notifiedAt of notifiedAts) {
				await notificationFactory.create({
					vulnerabilityId,
					notificationChannelId: notificationChannelId2,
					notifiedAt,
				});
			}

			const notifications = await repository.fetchLatestByVulnerabilityIds({
				notificationChannelId: notificationChannelId1,
				vulnerabilityIds: [vulnerabilityId],
			});

			expect(notifications).toHaveLength(1);
			expect(
				notifications.every(
					(notification) =>
						notification.notificationChannelId === notificationChannelId1,
				),
			).toBe(true);
			expect(
				notifications.some(
					(notification) =>
						notification.notificationChannelId === notificationChannelId2,
				),
			).toBe(false);
		});

		it("vulnerabilityIdsが空配列の場合、空配列が返ること", async () => {
			const vulnerabilityId = (await vulnerabilityFactory.create()).id;
			const notificationChannelId = (await notificationChannelFactory.create())
				.id;
			const notifiedAt = new Date("2026-01-01");

			await notificationFactory.create({
				vulnerabilityId,
				notificationChannelId,
				notifiedAt,
			});

			const notifications = await repository.fetchLatestByVulnerabilityIds({
				notificationChannelId,
				vulnerabilityIds: [],
			});

			expect(notifications).toHaveLength(0);
			expect(notifications).toEqual([]);
		});
	});

	describe("createManyメソッド", () => {
		let repository: PrismaNotificationRepository;

		beforeEach(() => {
			repository = new PrismaNotificationRepository();
		});

		it("notificationレコードが複数新規作成されること", async () => {
			const newNotificationProps: NewNotificationProps[] = [];
			const targetCount = 3;
			const baseDate = new Date();

			for (let i = 0; i < targetCount; i++) {
				const notificationChannel = await notificationChannelFactory.create();
				const vulnerability = await vulnerabilityFactory.create();

				newNotificationProps.push(
					newNotificationPropsFactory.build({
						notificationChannelId: notificationChannel.id,
						vulnerabilityId: vulnerability.id,
						notifiedAt: new Date(baseDate.getTime() + i * 1000),
					}),
				);
			}

			const notifications = newNotificationProps.map((notification) =>
				Notification.create(notification),
			);

			const createdNotifications = await repository.createMany(notifications);

			expect(createdNotifications).toHaveLength(targetCount);

			const byVulnerabilityId = new Map(
				createdNotifications.map((notification) => [
					notification.vulnerabilityId,
					notification,
				]),
			);

			for (const notification of notifications) {
				const created = byVulnerabilityId.get(notification.vulnerabilityId);
				// stringはプリミティブなので値そのものが比較される。参照比較のtoBeで問題ない
				expect(created?.notificationChannelId).toBe(
					notification.notificationChannelId,
				);
				// DateはtoBe(参照比較)だと別インスタンス同士で必ず失敗するため、値を比較するtoEqualを使う
				expect(created?.notifiedAt).toEqual(notification.notifiedAt);
			}
		});
	});
});
