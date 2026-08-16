import { Batch } from "@/domain/batch/entity.js";
import type { ReconstructedBatchProps } from "@/domain/batch/entity.type.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class PrismaBatchMapper {
	// レコードからエンティティへ変換
	static toDomain(record: ReconstructedBatchProps): Batch {
		return Batch.reconstruct(record);
	}

	// エンティティからPrismaが永続化できる形へ変換。フィールドがprivateなgetter越しにしか読めないため、
	// Prismaが要求するキー名のプレーンな値に詰め替える必要がある
	static toCreatePersistence(batch: Batch): Prisma.BatchCreateInput {
		return {
			triggerType: batch.triggerType,
			user: batch.triggeredBy
				? {
						connect: { id: batch.triggeredBy },
					}
				: undefined,
			executedAt: batch.executedAt,
			status: batch.status,
		};
	}
}
