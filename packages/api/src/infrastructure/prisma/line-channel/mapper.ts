import { LineChannel } from "@/domain/line-channel/entity.js";
import type {
	LineChannel as LineChannelRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaLineChannelMapper {
	static toDomain(record: LineChannelRecord): LineChannel {
		const { id, notificationChannelId, lineUserId } = record;
		return LineChannel.reconstruct({
			id,
			notificationChannelId,
			lineUserId,
		});
	}

	static toCreatePersistence(
		lineChannel: LineChannel,
	): Prisma.LineChannelCreateInput {
		const { notificationChannelId, lineUserId } = lineChannel;
		return {
			notificationChannel: { connect: { id: notificationChannelId } },
			lineUserId,
		};
	}
}
