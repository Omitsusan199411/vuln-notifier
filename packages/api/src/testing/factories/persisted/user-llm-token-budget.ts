import { Factory } from "fishery";
import { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";
import type { NewUserLlmTokenBudgetProps } from "@/domain/user-llm-token-budget/entity.type.js";
import type { UserLlmTokenBudget as UserLlmTokenBudgetRecord } from "@/generated/prisma/client.js";
import { PrismaUserLlmTokenBudgetMapper } from "@/infrastructure/prisma/user-llm-token-budget/mapper.js";
import prisma from "@/lib/prisma.js";
import { newUserLlmTokenBudgetPropsFactory } from "@/testing/factories/user-llm-token-budget.js";
import { userFactory } from "./user.js";

export const userLlmTokenBudgetFactory = Factory.define<
	NewUserLlmTokenBudgetProps,
	unknown,
	UserLlmTokenBudgetRecord
>(({ onCreate, params }) => {
	onCreate(async (userLlmTokenBudget) => {
		const userId =
			params.userId !== undefined
				? params.userId
				: (await userFactory.create()).id;

		const data = PrismaUserLlmTokenBudgetMapper.toCreatePersistence(
			UserLlmTokenBudget.create({
				...userLlmTokenBudget,
				userId,
			}),
		);

		return await prisma.userLlmTokenBudget.create({ data });
	});

	return newUserLlmTokenBudgetPropsFactory.build();
});
