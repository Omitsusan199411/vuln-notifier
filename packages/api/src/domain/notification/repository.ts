import type { Notification } from "@/domain/notification/entity.js";

export interface NotificationRepository {
	fetchLatestByVulnerabilityIds(params: {
		notificationChannelId: string;
		vulnerabilityIds: string[];
	}): Promise<Notification[]>;
	createMany(notifications: Notification[]): Promise<Notification[]>;
}
