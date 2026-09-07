import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewNotificationProps,
	ReconstructedNotificationProps,
} from "@/domain/notification/entity.type.js";

export const reconstructedNotificationPropsFactory =
	Factory.define<ReconstructedNotificationProps>(() => ({
		id: faker.string.uuid({ version: 7 }),
		notificationChannelId: faker.string.nanoid(),
		vulnerabilityId: faker.string.uuid({ version: 7 }),
		notifiedAt: faker.date.recent(),
	}));

export const newNotificationPropsFactory = Factory.define<NewNotificationProps>(
	() => ({
		notificationChannelId: faker.string.nanoid(),
		vulnerabilityId: faker.string.uuid({ version: 7 }),
		notifiedAt: faker.date.recent(),
	}),
);
