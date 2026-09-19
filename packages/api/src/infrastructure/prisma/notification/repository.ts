import type { Notification } from "@/domain/notification/entity.js";
import type { NotificationRepository } from "@/domain/notification/repository.js";
import prisma from "@/lib/prisma.js";
import { PrismaNotificationMapper } from "./mapper.js";

export class PrismaNotificationRepository implements NotificationRepository {
	// vulnerabilityIdsのうち、チャネルで通知済みのものだけ、vulnerabilityIdごとに通知日が最新の通知1件を返す（通知済みが無いvulnerabilityIdは結果に含まれない）
	async fetchLatestByVulnerabilityIds(params: {
		notificationChannelId: string;
		vulnerabilityIds: string[];
	}): Promise<Notification[]> {
		const { notificationChannelId, vulnerabilityIds } = params;

		if (vulnerabilityIds.length === 0) return [];

		// groupByはvulnerabilityIdごとの最大notifiedAt(集計値)しか返せず、id等を含む行全体は取得できない。
		// そのためこの最大値を条件にもう一度findManyし、実際のレコードを引き直す。返り値のイメージ
		// [
		// 	{ vulnerabilityId: "v1", _max: { notifiedAt: 2026-01-01T00:00:00.000Z } },
		// 	{ vulnerabilityId: "v2", _max: { notifiedAt: 2026-01-02T00:00:00.000Z } },
		// ]
		const latestGroups = await prisma.notification.groupBy({
			by: ["vulnerabilityId"],
			where: {
				notificationChannelId,
				vulnerabilityId: { in: vulnerabilityIds },
			},
			_max: {
				notifiedAt: true,
			},
		});

		const notificationRecords = await prisma.notification.findMany({
			where: {
				notificationChannelId,
				OR: latestGroups.map((group) => ({
					vulnerabilityId: group.vulnerabilityId,
					notifiedAt: group._max.notifiedAt ?? undefined,
				})),
			},
			distinct: ["vulnerabilityId"],
		});

		return notificationRecords.map((record) =>
			PrismaNotificationMapper.toDomain(record),
		);
	}

	async createMany(notifications: Notification[]): Promise<Notification[]> {
		const data = notifications.map((notification) =>
			PrismaNotificationMapper.toCreatePersistence(notification),
		);

		const createdNotifications = await prisma.notification.createManyAndReturn({
			data,
		});

		return createdNotifications.map((notification) =>
			PrismaNotificationMapper.toDomain(notification),
		);
	}
}
