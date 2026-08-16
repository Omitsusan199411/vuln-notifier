import type { Batch } from "@/domain/batch/entity.js";
import type {
	BatchStatus,
	BatchTriggerType,
	NewBatchProps,
} from "@/domain/batch/entity.type.js";

export interface BatchRepository {
	findById(batchId: string): Promise<Batch | null>;
	fetchList(params: {
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
	}>;
	create(props: NewBatchProps): Promise<Batch>;
}
