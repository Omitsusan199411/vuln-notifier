import type { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type { NotificationChannelType } from "@/domain/notification-channel/entity.type.js";
import type { NotificationChannelRepository } from "@/domain/notification-channel/repository.js";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "@/infrastructure/prisma/shared/pagination.js";
import prisma from "@/lib/prisma.js";
import { PrismaNotificationChannelMapper } from "./mapper.js";

export class PrismaNotificationChannelRepository
	implements NotificationChannelRepository
{
	async findById(
		notificationChannelId: string,
	): Promise<NotificationChannel | null> {
		const foundNotificationChannel =
			await prisma.notificationChannel.findUnique({
				where: {
					id: notificationChannelId,
				},
			});
		if (!foundNotificationChannel) return null;
		return PrismaNotificationChannelMapper.toDomain(foundNotificationChannel);
	}

	async fetchList(params: {
		cursor?: string;
		limit?: number;
		userId?: string;
		type?: NotificationChannelType;
		enabled?: boolean;
		sort?: "desc" | "asc";
	}): Promise<{
		notificationChannels: NotificationChannel[];
		lastCursor: string | null;
	}> {
		const { cursor, limit = 10, userId, type, enabled, sort = "desc" } = params;

		const paginationParams = buildCursorQueryOptions({
			cursor,
			limit,
		});

		const fetchedNotificationChannels =
			await prisma.notificationChannel.findMany({
				where: {
					userId,
					type,
					enabled,
				},
				orderBy: {
					createdAt: sort,
				},
				...paginationParams,
			});

		const { slicedRecords, hasNextPage } = sliceCursorPage(
			fetchedNotificationChannels,
			limit,
		);

		const notificationChannels = slicedRecords.map((notificationChannel) =>
			PrismaNotificationChannelMapper.toDomain(notificationChannel),
		);

		const lastCursor = hasNextPage
			? (notificationChannels.at(-1)?.id ?? null)
			: null;

		return { notificationChannels, lastCursor };
	}

	async create(
		notificationChannel: NotificationChannel,
	): Promise<NotificationChannel> {
		const data =
			PrismaNotificationChannelMapper.toCreatePersistence(notificationChannel);

		const createdNotificationChannel = await prisma.notificationChannel.create({
			data,
		});
		return PrismaNotificationChannelMapper.toDomain(createdNotificationChannel);
	}

	async update(
		notificationChannel: NotificationChannel,
	): Promise<NotificationChannel> {
		const data =
			PrismaNotificationChannelMapper.toUpdatePersistence(notificationChannel);

		const record = await prisma.notificationChannel.update({
			where: { id: notificationChannel.id },
			data,
		});

		return PrismaNotificationChannelMapper.toDomain(record);
	}

	async deleteById(notificationChannelId: string): Promise<void> {
		await prisma.notificationChannel.delete({
			where: {
				id: notificationChannelId,
			},
		});
	}
}
