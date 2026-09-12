import type { LineChannel } from "@/domain/line-channel/entity.js";

export interface LineChannelRepository {
	findByNotificationChannelId(
		notificationChannelId: string,
	): Promise<LineChannel | null>;
	create(lineChannel: LineChannel): Promise<LineChannel>;
	deleteById(lineChannelId: string): Promise<void>;
}
