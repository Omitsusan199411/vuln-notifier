import type { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";

export interface UserLlmTokenBudgetRepository {
	findByUserId(userId: string): Promise<UserLlmTokenBudget | null>;
	create(uerLlmTokenBudget: UserLlmTokenBudget): Promise<UserLlmTokenBudget>;
	update(uerLlmTokenBudget: UserLlmTokenBudget): Promise<UserLlmTokenBudget>;
}
