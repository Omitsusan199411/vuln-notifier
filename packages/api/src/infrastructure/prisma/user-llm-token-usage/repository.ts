import type { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";
import type { UserLlmTokenUsageRepository } from "@/domain/user-llm-token-usage/repository.js";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "@/infrastructure/prisma/shared/pagination.js";
import { PrismaUserLlmTokenUsageMapper } from "@/infrastructure/prisma/user-llm-token-usage/mapper.js";
import prisma from "@/lib/prisma.js";

export class PrismaUserLlmTokenUsageRepository
	implements UserLlmTokenUsageRepository
{
	async findByUserModelYearMonth(params: {
		userId: string;
		year: number;
		month: number;
		modelId: string;
	}): Promise<UserLlmTokenUsage | null> {
		const { userId, year, month, modelId } = params;

		const userLlmTokenUsage = await prisma.userLlmTokenUsage.findUnique({
			where: {
				userId_modelId_year_month: {
					userId,
					modelId,
					year,
					month,
				},
			},
		});

		if (!userLlmTokenUsage) return null;
		return PrismaUserLlmTokenUsageMapper.toDomain(userLlmTokenUsage);
	}

	async fetchList(params: {
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
	}> {
		const {
			cursor,
			limit = 10,
			userId,
			year,
			month,
			modelId,
			sort = "desc",
		} = params;

		const paginationParams = buildCursorQueryOptions({
			cursor,
			limit,
		});

		const fetchedUserLlmTokenUsages = await prisma.userLlmTokenUsage.findMany({
			where: {
				userId,
				year,
				month,
				modelId,
			},
			orderBy: {
				createdAt: sort,
			},
			...paginationParams,
		});

		const { slicedRecords, hasNextPage } = sliceCursorPage(
			fetchedUserLlmTokenUsages,
			limit,
		);

		const userLlmTokenUsages = slicedRecords.map((userLlmTokenUsage) =>
			PrismaUserLlmTokenUsageMapper.toDomain(userLlmTokenUsage),
		);

		const lastCursor = hasNextPage
			? (userLlmTokenUsages.at(-1)?.id ?? null)
			: null;

		return { userLlmTokenUsages, lastCursor };
	}

	async create(
		userLlmTokenUsage: UserLlmTokenUsage,
	): Promise<UserLlmTokenUsage> {
		const data =
			PrismaUserLlmTokenUsageMapper.toCreatePersistence(userLlmTokenUsage);

		const createdUserLlmTokenUsage = await prisma.userLlmTokenUsage.create({
			data,
		});

		return PrismaUserLlmTokenUsageMapper.toDomain(createdUserLlmTokenUsage);
	}

	async update(
		userLlmTokenUsage: UserLlmTokenUsage,
	): Promise<UserLlmTokenUsage> {
		const data =
			PrismaUserLlmTokenUsageMapper.toUpdatePersistence(userLlmTokenUsage);

		const updatedUserLlmTokenUsage = await prisma.userLlmTokenUsage.update({
			where: {
				id: userLlmTokenUsage.id,
			},
			data,
		});

		return PrismaUserLlmTokenUsageMapper.toDomain(updatedUserLlmTokenUsage);
	}
}
