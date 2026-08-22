import { Factory } from "fishery";
import { Batch } from "@/domain/batch/entity.js";
import type { NewBatchProps } from "@/domain/batch/entity.type.js";
import type { Batch as BatchRecord } from "@/generated/prisma/client.js";
import { PrismaBatchMapper } from "@/infrastructure/prisma/batch/mapper.js";
import prisma from "@/lib/prisma.js";
import { newBatchFactory } from "@/testing/factories/batch.js";
import { userFactory } from "@/testing/factories/persisted/user.js";

// buildとcreateの責務を持つ。実際にDBへ保存するので、ドメイン層のテストからは使わない
export const batchFactory = Factory.define<
	NewBatchProps,
	{ user?: { id: string } },
	BatchRecord
>(({ onCreate, transientParams }) => {
	onCreate(async (batch) => {
		const user = transientParams.user ?? (await userFactory.create());

		const data = PrismaBatchMapper.toCreatePersistence(
			Batch.create({ ...batch, triggeredBy: user.id }),
		);

		return prisma.batch.create({
			data,
		});
	});

	// デフォルト値はbuild専用のnewBatchFactoryから借りる（重複させない）
	return newBatchFactory.build();
});
