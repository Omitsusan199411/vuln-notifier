import { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";
import type { Prisma } from "@/generated/prisma/browser.js";
import type { UserLlmTokenBudget as UserLlmTokenBudgetRecord } from "@/generated/prisma/client.js";

export class PrismaUserLlmTokenBudgetMapper {
	static toDomain(record: UserLlmTokenBudgetRecord): UserLlmTokenBudget {
		const { id, userId, monthlyTokenBudget } = record;
		return UserLlmTokenBudget.reconstruct({
			id,
			userId,
			monthlyTokenBudget,
		});
	}

	static toCreatePersistence(
		userLlmTokenBudget: UserLlmTokenBudget,
	): Prisma.UserLlmTokenBudgetCreateInput {
		const { userId, monthlyTokenBudget } = userLlmTokenBudget;
		return {
			user: {
				connect: { id: userId },
			},
			monthlyTokenBudget,
		};
	}

	static toUpdatePersistence(
		userLlmTokenBudget: UserLlmTokenBudget,
	): Prisma.UserLlmTokenBudgetUpdateInput {
		const { id, userId, monthlyTokenBudget } = userLlmTokenBudget;
		return {
			id,
			user: {
				connect: { id: userId },
			},
			monthlyTokenBudget,
		};
	}
}
