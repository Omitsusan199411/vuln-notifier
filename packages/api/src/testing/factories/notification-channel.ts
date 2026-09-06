import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewNotificationChannelProps,
	ReconstructedNotificationChannelProps,
} from "@/domain/notification-channel/entity.type.js";

export const reconstructedNotificationChannelPropsFactory =
	Factory.define<ReconstructedNotificationChannelProps>(() => ({
		id: faker.string.nanoid(),
		userId: faker.string.nanoid(),
		type: "line",
		maxNotificationLimit: faker.number.int({ min: 1, max: 10 }),
		enabled: faker.datatype.boolean(),
		minSeverity: "high",
		minCvssScore: faker.number.float({ min: 0, max: 10.0 }),
		cvssScoreOrderBy: "desc",
		notificationIntervalMinutes: faker.number.int({ min: 60, max: 1440 }),
		lastProcessedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
	}));

export const newNotificationChannelPropsFactory =
	Factory.define<NewNotificationChannelProps>(() => ({
		userId: faker.string.nanoid(),
		type: "line",
		maxNotificationLimit: faker.number.int({ min: 1, max: 10 }),
		enabled: faker.datatype.boolean(),
		minSeverity: "high",
		minCvssScore: faker.number.float({ min: 0, max: 10.0 }),
		cvssScoreOrderBy: "desc",
		notificationIntervalMinutes: faker.number.int({ min: 60, max: 1440 }),
		lastProcessedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
	}));
