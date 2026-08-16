import { Batch } from "@/domain/batch/entity.js";
import type {
	BatchStatus,
	BatchTriggerType,
	NewBatchProps,
	ReconstructedBatchProps,
} from "@/domain/batch/entity.type.js";
import type { BatchRepository } from "@/domain/batch/repository.js";
import { PrismaBatchMapper } from "@/infrastructure/prisma/batch/mapper.js";
import prisma from "@/lib/prisma.js";

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
		limit: number;
		triggerType?: BatchTriggerType;
		triggeredBy?: string | null; // nullの場合は「自動バッチを意味する」
		executedAt?: Date;
		status?: BatchStatus;
		sort: "desc" | "asc";
	}): Promise<{
		batches: Batch[];
		lastCursor: string | null;
	}> {
		const {
			cursor,
			limit,
			triggerType,
			triggeredBy,
			executedAt,
			status,
			sort,
		} = params;

		// 次のページがあるかを判定するため、limit件より1件多く取得する
		const PEEK_AHEAD_COUNT = 1;
		// cursorの行自体を含めない（前回の最後の1件を今回も返さないようにする）ためskipする件数
		const EXCLUSIVE_CURSOR_OFFSET = 1;

		const cursorOption = cursor ? { id: cursor } : undefined;
		const skipCount = cursor ? EXCLUSIVE_CURSOR_OFFSET : undefined;
		const limitOption = limit + PEEK_AHEAD_COUNT;

		const fetchedBatches = await prisma.batch.findMany({
			where: {
				triggerType: triggerType,
				triggeredBy: triggeredBy,
				executedAt: executedAt,
				status: status,
			},
			orderBy: {
				id: sort,
			},
			cursor: cursorOption,
			skip: skipCount,
			take: limitOption,
		});

		const batches = fetchedBatches
			.slice(0, limit)
			.map((batch) => PrismaBatchMapper.toDomain(batch));

		const lastCursor = this.hasNextPage(fetchedBatches, limitOption)
			? (batches.at(-1)?.id ?? null)
			: null;

		return { batches, lastCursor };
	}

	async create(props: NewBatchProps): Promise<Batch> {
		const batch = Batch.create(props);
		const data = PrismaBatchMapper.toCreatePersistence(batch);
		const createdBatch = await prisma.batch.create({
			data,
		});
		const domain = PrismaBatchMapper.toDomain(createdBatch);

		return domain;
	}

	private hasNextPage(
		fetchedBatches: ReconstructedBatchProps[],
		limitOption: number,
	): boolean {
		return fetchedBatches.length >= limitOption;
	}
}
