import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewAppLlmTokenUsageProps,
	ReconstructedAppLlmTokenUsageProps,
} from "@/domain/app-llm-token-usage/entity.type.js";

export const reconstructedAppLlmTokenUsagePropsFactory =
	Factory.define<ReconstructedAppLlmTokenUsageProps>(() => ({
		id: faker.string.nanoid(),
		year: faker.date.recent().getFullYear(),
		month: faker.number.int({ min: 1, max: 12 }),
		modelId: faker.string.nanoid(),
		inputTokens: faker.number.int({ min: 0, max: 100000 }),
		outputTokens: faker.number.int({ min: 0, max: 100000 }),
	}));

export const newAppLlmTokenUsagePropsFactory =
	Factory.define<NewAppLlmTokenUsageProps>(() => ({
		year: faker.date.recent().getFullYear(),
		month: faker.number.int({ min: 1, max: 12 }),
		modelId: faker.string.nanoid(),
		inputTokens: faker.number.int({ min: 0, max: 100000 }),
		outputTokens: faker.number.int({ min: 0, max: 100000 }),
	}));
