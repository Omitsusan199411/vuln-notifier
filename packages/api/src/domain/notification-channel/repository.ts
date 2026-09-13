import type { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type { NotificationChannelType } from "@/domain/notification-channel/entity.type.js";

export interface NotificationChannelRepository {
	findById(id: string): Promise<NotificationChannel | null>;
	fetchList(params: {
		cursor?: string;
		limit?: number;
		userId?: string;
		type?: NotificationChannelType;
		enabled?: boolean;
		sort?: "desc" | "asc";
	}): Promise<{
		notificationChannels: NotificationChannel[];
		lastCursor: string | null;
	}>;
	create(
		notificationChannel: NotificationChannel,
	): Promise<NotificationChannel>;
	update(
		notificationChannel: NotificationChannel,
	): Promise<NotificationChannel>;
	deleteById(notificationChannelId: string): Promise<void>;
}
