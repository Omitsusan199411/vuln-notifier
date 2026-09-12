import { Factory } from "fishery";
import { LineChannel } from "@/domain/line-channel/entity.js";
import type { NewLineChannelProps } from "@/domain/line-channel/entity.type.js";
import type { LineChannel as LineChannelRecord } from "@/generated/prisma/client.js";
import { PrismaLineChannelMapper } from "@/infrastructure/prisma/line-channel/mapper.js";
import prisma from "@/lib/prisma.js";
import { newLineChannelPropsFactory } from "@/testing/factories/line-channel.js";
import { notificationChannelFactory } from "@/testing/factories/persisted/notification-channel.js";

export const lineChannelFactory = Factory.define<
	NewLineChannelProps,
	unknown,
	LineChannelRecord
>(({ onCreate, params }) => {
	onCreate(async (lineChannel) => {
		const notificationChannelId =
			params.notificationChannelId !== undefined
				? params.notificationChannelId
				: (await notificationChannelFactory.create()).id;

		const data = PrismaLineChannelMapper.toCreatePersistence(
			LineChannel.create({ ...lineChannel, notificationChannelId }),
		);

		return await prisma.lineChannel.create({
			data,
		});
	});

	return newLineChannelPropsFactory.build();
});
