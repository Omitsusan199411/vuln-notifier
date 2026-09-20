import type { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";

export interface UserLlmTokenUsageRepository {
	findByUserModelYearMonth(params: {
		userId: string;
		year: number;
		month: number;
		modelId: string;
	}): Promise<UserLlmTokenUsage | null>;
	fetchList(params: {
		cursor?: string;
		limit?: number;
		userId: string;
		year?: number;
		month?: number;
		modelId?: string;
		sort?: "desc" | "asc";
	}): Promise<{
		userLlmTokenUsages: UserLlmTokenUsage[];
		lastCursor: string | null;
	}>;
	create(userLlmTokenUsage: UserLlmTokenUsage): Promise<UserLlmTokenUsage>;
	update(userLlmTokenUsage: UserLlmTokenUsage): Promise<UserLlmTokenUsage>;
}
