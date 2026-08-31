import type { Batch } from "@/domain/batch/entity.js";
import type {
	BatchStatus,
	BatchTriggerType,
} from "@/domain/batch/entity.type.js";
import type { BatchRepository } from "@/domain/batch/repository.js";
import { PrismaBatchMapper } from "@/infrastructure/prisma/batch/mapper.js";
import prisma from "@/lib/prisma.js";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "../shared/pagination.js";

export class PrismaBatchRepository implements BatchRepository {
	async findById(batchId: string): Promise<Batch | null> {
		const batch = await prisma.batch.findUnique({
			where: {
				id: batchId,
			},
		});
		if (!batch) return null;
		return PrismaBatchMapper.toDomain(batch);
	}

	async fetchList(params: {
		cursor?: string;
		limit?: number;
		triggerType?: BatchTriggerType;
		triggeredBy?: string | null; // nullの場合は「自動バッチを意味する」
		executedAt?: Date;
		status?: BatchStatus;
		sort?: "desc" | "asc";
	}): Promise<{
		batches: Batch[];
		lastCursor: string | null;
	}> {
		const {
			cursor,
			limit = 10,
			triggerType,
			triggeredBy,
			executedAt,
			status,
			sort = "desc",
		} = params;

		const paginationParams = buildCursorQueryOptions({
			cursor,
			limit,
		});

		const fetchedBatches = await prisma.batch.findMany({
			where: {
				triggerType: triggerType,
				triggeredBy: triggeredBy,
				executedAt: executedAt,
				status: status,
			},
			orderBy: {
				createdAt: sort,
			},
			...paginationParams,
		});

		const { slicedRecords, hasNextPage } = sliceCursorPage(
			fetchedBatches,
			limit,
		);

		const batches = slicedRecords.map((batch) =>
			PrismaBatchMapper.toDomain(batch),
		);

		const lastCursor = hasNextPage ? (batches.at(-1)?.id ?? null) : null;

		return { batches, lastCursor };
	}

	async create(batch: Batch): Promise<Batch> {
		const data = PrismaBatchMapper.toCreatePersistence(batch);
		const createdBatch = await prisma.batch.create({
			data,
		});
		return PrismaBatchMapper.toDomain(createdBatch);
	}
}
