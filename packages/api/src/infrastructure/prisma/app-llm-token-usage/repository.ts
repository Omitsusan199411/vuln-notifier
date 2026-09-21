import type { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";
import type { AppLlmTokenUsageRepository } from "@/domain/app-llm-token-usage/repository.js";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "@/infrastructure/prisma/shared/pagination.js";
import prisma from "@/lib/prisma.js";
import { PrismaAppLlmTokenUsageMapper } from "./mapper.js";

export class PrismaAppLlmTokenUsage implements AppLlmTokenUsageRepository {
	async findByModelYearMonth(params: {
		year: number;
		month: number;
		modelId: string;
	}): Promise<AppLlmTokenUsage | null> {
		const { year, month, modelId } = params;

		const foundAppLlmTokenUsage = await prisma.appLlmTokenUsage.findUnique({
			where: {
				modelId_year_month: {
					modelId,
					year,
					month,
				},
			},
		});

		if (!foundAppLlmTokenUsage) return null;
		return PrismaAppLlmTokenUsageMapper.toDomain(foundAppLlmTokenUsage);
	}

	async fetchList(params: {
		cursor?: string;
		limit?: number;
		year?: number;
		month?: number;
		modelId?: string;
		sort?: "desc" | "asc";
	}): Promise<{
		appLlmTokenUsages: AppLlmTokenUsage[];
		lastCursor: string | null;
	}> {
		const { cursor, limit = 10, year, month, modelId, sort = "desc" } = params;

		const paginationParams = buildCursorQueryOptions({
			cursor,
			limit,
		});

		const fetchedAppLlmTokenUsages = await prisma.appLlmTokenUsage.findMany({
			where: {
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
			fetchedAppLlmTokenUsages,
			limit,
		);

		const appLlmTokenUsages = slicedRecords.map((appLlmTokenUsage) =>
			PrismaAppLlmTokenUsageMapper.toDomain(appLlmTokenUsage),
		);

		const lastCursor = hasNextPage
			? (appLlmTokenUsages.at(-1)?.id ?? null)
			: null;

		return { appLlmTokenUsages, lastCursor };
	}

	async create(appLlmTokenUsage: AppLlmTokenUsage): Promise<AppLlmTokenUsage> {
		const data =
			PrismaAppLlmTokenUsageMapper.toCreatePersistence(appLlmTokenUsage);

		const createdAppLlmTokenUsage = await prisma.appLlmTokenUsage.create({
			data,
		});

		return PrismaAppLlmTokenUsageMapper.toDomain(createdAppLlmTokenUsage);
	}

	async update(appLlmTokenUsage: AppLlmTokenUsage): Promise<AppLlmTokenUsage> {
		const data =
			PrismaAppLlmTokenUsageMapper.toUpdatePersistence(appLlmTokenUsage);

		const updatedUserLlmTokenUsage = await prisma.appLlmTokenUsage.update({
			where: {
				id: appLlmTokenUsage.id,
			},
			data,
		});

		return PrismaAppLlmTokenUsageMapper.toDomain(updatedUserLlmTokenUsage);
	}
}
