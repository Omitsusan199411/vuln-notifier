import { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";
import type { Prisma } from "@/generated/prisma/browser.js";
import type { AppLlmTokenUsage as AppLlmTokenUsageRecord } from "@/generated/prisma/client.js";

export class PrismaAppLlmTokenUsageMapper {
	static toDomain(record: AppLlmTokenUsageRecord): AppLlmTokenUsage {
		const { id, year, month, modelId, inputTokens, outputTokens } = record;
		return AppLlmTokenUsage.reconstruct({
			id,
			year,
			month,
			modelId,
			inputTokens,
			outputTokens,
		});
	}

	static toCreatePersistence(
		appLlmTokenUsage: AppLlmTokenUsage,
	): Prisma.AppLlmTokenUsageCreateInput {
		const { year, month, modelId, inputTokens, outputTokens } =
			appLlmTokenUsage;
		return {
			year,
			month,
			llmModel: {
				connect: {
					id: modelId,
				},
			},
			inputTokens,
			outputTokens,
		};
	}

	static toUpdatePersistence(
		appLlmTokenUsage: AppLlmTokenUsage,
	): Prisma.AppLlmTokenUsageUpdateInput {
		const { id, year, month, modelId, inputTokens, outputTokens } =
			appLlmTokenUsage;
		return {
			id,
			year,
			month,
			llmModel: {
				connect: {
					id: modelId,
				},
			},
			inputTokens,
			outputTokens,
		};
	}
}
