import { Notification } from "@/domain/notification/entity.js";
import type {
	Notification as NotificationRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaNotificationMapper {
	static toDomain(record: NotificationRecord): Notification {
		const { id, notificationChannelId, vulnerabilityId, notifiedAt } = record;
		return Notification.reconstruct({
			id,
			notificationChannelId,
			vulnerabilityId,
			notifiedAt,
		});
	}

	static toCreatePersistence(
		notification: Notification,
	): Prisma.NotificationCreateManyInput {
		const { notificationChannelId, vulnerabilityId, notifiedAt } = notification;
		return {
			notificationChannelId,
			vulnerabilityId,
			notifiedAt,
		};
	}
}
