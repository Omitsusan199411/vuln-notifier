import type { LineChannel } from "@/domain/line-channel/entity.js";
import type { LineChannelRepository } from "@/domain/line-channel/repository.js";
import { PrismaLineChannelMapper } from "@/infrastructure/prisma/line-channel/mapper.js";
import prisma from "@/lib/prisma.js";

export class PrismaLineChannelRepository implements LineChannelRepository {
	async findByNotificationChannelId(
		notificationChannelId: string,
	): Promise<LineChannel | null> {
		const foundLineChannelRecord = await prisma.lineChannel.findUnique({
			where: { notificationChannelId },
		});
		if (!foundLineChannelRecord) return null;
		return PrismaLineChannelMapper.toDomain(foundLineChannelRecord);
	}

	async create(lineChannel: LineChannel): Promise<LineChannel> {
		const data = PrismaLineChannelMapper.toCreatePersistence(lineChannel);
		const createdLineChannel = await prisma.lineChannel.create({
			data,
		});
		return PrismaLineChannelMapper.toDomain(createdLineChannel);
	}

	async deleteById(lineChannelId: string): Promise<void> {
		await prisma.lineChannel.delete({
			where: {
				id: lineChannelId,
			},
		});
	}
}
