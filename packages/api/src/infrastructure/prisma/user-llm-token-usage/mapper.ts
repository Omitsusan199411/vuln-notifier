import { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";
import type {
	Prisma,
	UserLlmTokenUsage as UserLlmTokenUsageRecord,
} from "@/generated/prisma/client.js";

export class PrismaUserLlmTokenUsageMapper {
	static toDomain(record: UserLlmTokenUsageRecord): UserLlmTokenUsage {
		const { id, userId, year, month, modelId, inputTokens, outputTokens } =
			record;

		return UserLlmTokenUsage.reconstruct({
			id,
			userId,
			year,
			month,
			modelId,
			inputTokens,
			outputTokens,
		});
	}

	static toCreatePersistence(
		userLlmTokenUsage: UserLlmTokenUsage,
	): Prisma.UserLlmTokenUsageCreateInput {
		const { userId, year, month, modelId, inputTokens, outputTokens } =
			userLlmTokenUsage;

		return {
			user: {
				connect: {
					id: userId,
				},
			},
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
		userLlmTokenUsage: UserLlmTokenUsage,
	): Prisma.UserLlmTokenUsageUpdateInput {
		const { id, userId, year, month, modelId, inputTokens, outputTokens } =
			userLlmTokenUsage;

		return {
			id,
			user: {
				connect: {
					id: userId,
				},
			},
			llmModel: {
				connect: {
					id: modelId,
				},
			},
			year,
			month,
			inputTokens,
			outputTokens,
		};
	}
}
