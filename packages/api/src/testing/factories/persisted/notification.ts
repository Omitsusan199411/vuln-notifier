import { Factory } from "fishery";
import { Notification } from "@/domain/notification/entity.js";
import type { NewNotificationProps } from "@/domain/notification/entity.type.js";
import type { Notification as NotificationRecord } from "@/generated/prisma/client.js";
import { PrismaNotificationMapper } from "@/infrastructure/prisma/notification/mapper.js";
import prisma from "@/lib/prisma.js";
import { newNotificationPropsFactory } from "@/testing/factories/notification.js";
import { notificationChannelFactory } from "@/testing/factories/persisted/notification-channel.js";
import { vulnerabilityFactory } from "@/testing/factories/persisted/vulnerability.js";

export const notificationFactory = Factory.define<
	NewNotificationProps,
	unknown,
	NotificationRecord
>(({ onCreate, params }) => {
	onCreate(async (notification) => {
		const notificationChannelId =
			params.notificationChannelId !== undefined
				? params.notificationChannelId
				: (await notificationChannelFactory.create()).id;
		const vulnerabilityId =
			params.vulnerabilityId !== undefined
				? params.vulnerabilityId
				: (await vulnerabilityFactory.create()).id;

		const data = PrismaNotificationMapper.toCreatePersistence(
			Notification.create({
				...notification,
				notificationChannelId,
				vulnerabilityId,
			}),
		);

		return await prisma.notification.create({
			data,
		});
	});
	return newNotificationPropsFactory.build();
});
