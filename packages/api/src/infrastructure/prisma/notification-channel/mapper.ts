import { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type {
	NotificationChannel as NotificationChannelRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaNotificationChannelMapper {
	static toDomain(record: NotificationChannelRecord): NotificationChannel {
		const {
			id,
			userId,
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		} = record;
		return NotificationChannel.reconstruct({
			id,
			userId,
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		});
	}

	static toCreatePersistence(
		notificationChannel: NotificationChannel,
	): Prisma.NotificationChannelCreateInput {
		const {
			userId,
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		} = notificationChannel;
		return {
			user: { connect: { id: userId } },
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		};
	}

	// update用
	static toUpdatePersistence(
		notificationChannel: NotificationChannel,
	): Prisma.NotificationChannelUpdateInput {
		const {
			id,
			userId,
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		} = notificationChannel;

		return {
			id,
			user: { connect: { id: userId } },
			type,
			maxNotificationLimit,
			enabled,
			minSeverity,
			minCvssScore,
			cvssScoreOrderBy,
			notificationIntervalMinutes,
			lastProcessedAt,
		};
	}
}
