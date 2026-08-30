import { Batch } from "@/domain/batch/entity.js";
import type {
	Batch as BatchRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaBatchMapper {
	// レコードからエンティティへ変換
	static toDomain(record: BatchRecord): Batch {
		const { id, triggerType, triggeredBy, executedAt, status } = record;
		return Batch.reconstruct({
			id,
			triggerType,
			triggeredBy,
			executedAt,
			status,
		});
	}

	// ドメインエンティティをPrismaが永続化できる形へ整形する。
	// Prismaが要求するキー名のプレーンな値に詰め替える必要がある
	static toCreatePersistence(batch: Batch): Prisma.BatchCreateInput {
		const { triggerType, triggeredBy, executedAt, status } = batch;
		return {
			triggerType,
			user: triggeredBy
				? {
						connect: { id: triggeredBy },
					}
				: undefined,
			executedAt,
			status,
		};
	}
}
