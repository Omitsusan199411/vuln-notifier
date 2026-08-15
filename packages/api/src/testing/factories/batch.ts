import { faker } from "@faker-js/faker";
import type {
	NewBatchProps,
	ReconstructedBatchProps,
} from "@/domain/batch/entity.type.js";
import { BatchStatus, BatchTriggerType } from "@/generated/prisma/enums.js";

// batchesテーブルに保存されたデータ（レコード）
export const createReconstructedBatchProps = (
	overrides: Partial<ReconstructedBatchProps>,
): ReconstructedBatchProps => {
	return {
		id: faker.string.uuid({
			version: 7,
		}),
		triggerType: BatchTriggerType.manual,
		triggeredBy: faker.string.nanoid(),
		executedAt: faker.date.recent(),
		status: BatchStatus.pending,
		...overrides,
	};
};

export const createNewBatchProps = (
	overrides: Partial<NewBatchProps>,
): NewBatchProps => {
	return {
		triggerType: BatchTriggerType.manual,
		triggeredBy: faker.string.nanoid(),
		executedAt: faker.date.recent(),
		status: BatchStatus.pending,
		...overrides,
	};
};
