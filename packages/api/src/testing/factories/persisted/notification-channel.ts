import { Factory } from "fishery";
import { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type { NewNotificationChannelProps } from "@/domain/notification-channel/entity.type.js";
import type { NotificationChannel as NotificationChannelRecord } from "@/generated/prisma/client.js";
import { PrismaNotificationChannelMapper } from "@/infrastructure/prisma/notification-channel/mapper.js";
import prisma from "@/lib/prisma.js";
import { newNotificationChannelPropsFactory } from "../notification-channel.js";
import { userFactory } from "./user.js";

export const notificationChannelFactory = Factory.define<
	NewNotificationChannelProps,
	unknown,
	NotificationChannelRecord
>(({ onCreate, params }) => {
	onCreate(async (notificationChannel) => {
		const userId =
			params.userId !== undefined
				? params.userId
				: (await userFactory.create()).id;

		const data = PrismaNotificationChannelMapper.toCreatePersistence(
			NotificationChannel.create({
				...notificationChannel,
				userId,
			}),
		);

		return await prisma.notificationChannel.create({
			data,
		});
	});

	return newNotificationChannelPropsFactory.build();
});
