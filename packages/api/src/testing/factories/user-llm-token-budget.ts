import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewUserLlmTokenBudgetProps,
	ReconstructedUserLlmTokenBudgetProps,
} from "@/domain/user-llm-token-budget/entity.type.js";

export const reconstructedUserLlmTokenBudgetPropsFactory =
	Factory.define<ReconstructedUserLlmTokenBudgetProps>(() => ({
		id: faker.string.nanoid(),
		userId: faker.string.nanoid(),
		monthlyTokenBudget: faker.number.int({ min: 10000, max: 500000 }),
	}));

export const newUserLlmTokenBudgetPropsFactory =
	Factory.define<NewUserLlmTokenBudgetProps>(() => ({
		userId: faker.string.nanoid(),
		monthlyTokenBudget: faker.number.int({ min: 10000, max: 500000 }),
	}));
