import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewLineChannelProps,
	ReconstructedLineChannelProps,
} from "@/domain/line-channel/entity.type.js";

export const reconstructedLineChannelPropsFactory =
	Factory.define<ReconstructedLineChannelProps>(() => ({
		id: faker.string.nanoid(),
		notificationChannelId: faker.string.nanoid(),
		lineUserId: faker.helpers.fromRegExp(/U[0-9a-f]{32}/),
	}));

export const newLineChannelPropsFactory = Factory.define<NewLineChannelProps>(
	() => ({
		notificationChannelId: faker.string.nanoid(),
		lineUserId: faker.helpers.fromRegExp(/U[0-9a-f]{32}/),
	}),
);
