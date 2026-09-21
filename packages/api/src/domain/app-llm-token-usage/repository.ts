import type { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";

export interface AppLlmTokenUsageRepository {
	findByModelYearMonth(params: {
		year: number;
		month: number;
		modelId: string;
	}): Promise<AppLlmTokenUsage | null>;
	fetchList(params: {
		cursor?: string;
		limit?: number;
		year?: number;
		month?: number;
		modelId?: string;
		sort?: "desc" | "asc";
	}): Promise<{
		appLlmTokenUsages: AppLlmTokenUsage[];
		lastCursor: string | null;
	}>;
	create(appLlmTokenUsage: AppLlmTokenUsage): Promise<AppLlmTokenUsage>;
	update(appLlmTokenUsage: AppLlmTokenUsage): Promise<AppLlmTokenUsage>;
}
