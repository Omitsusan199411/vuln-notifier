import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewBatchProps,
	ReconstructedBatchProps,
} from "@/domain/batch/entity.type.js";

// DBに保存済みのレコードを再現する。build専用（onCreateは無く、DBには触らない）
export const reconstructedBatchDomainFactory =
	Factory.define<ReconstructedBatchProps>(() => ({
		id: faker.string.uuid({ version: 7 }),
		triggerType: "manual",
		triggeredBy: faker.string.nanoid(),
		executedAt: faker.date.recent(),
		status: "pending",
	}));

// 新規作成前のBatchの形を組み立てる。build専用（onCreateは無く、DBには触らない）
export const newBatchDomainFactory = Factory.define<NewBatchProps>(() => ({
	triggerType: "manual",
	triggeredBy: faker.string.nanoid(),
	executedAt: faker.date.recent(),
	status: "pending",
}));
