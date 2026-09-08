import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewUserLlmTokenUsageProps,
	ReconstructedUserLlmTokenUsageProps,
} from "@/domain/user-llm-token-usage/entity.type.js";

export const reconstructedUserLlmTokenUsagePropsFactory =
	Factory.define<ReconstructedUserLlmTokenUsageProps>(() => ({
		id: faker.string.nanoid(),
		userId: faker.string.nanoid(),
		year: faker.date.recent().getFullYear(),
		month: faker.number.int({ min: 1, max: 12 }),
		modelId: faker.string.nanoid(),
		inputTokens: faker.number.int({ min: 0, max: 100000 }),
		outputTokens: faker.number.int({ min: 0, max: 100000 }),
	}));

export const newUserLlmTokenUsagePropsFactory =
	Factory.define<NewUserLlmTokenUsageProps>(() => ({
		userId: faker.string.nanoid(),
		year: faker.date.recent().getFullYear(),
		month: faker.number.int({ min: 1, max: 12 }),
		modelId: faker.string.nanoid(),
		inputTokens: faker.number.int({ min: 0, max: 100000 }),
		outputTokens: faker.number.int({ min: 0, max: 100000 }),
	}));
