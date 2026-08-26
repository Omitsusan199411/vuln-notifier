import { Factory } from "fishery";
import { Batch } from "@/domain/batch/entity.js";
import type { NewBatchProps } from "@/domain/batch/entity.type.js";
import type { Batch as BatchRecord } from "@/generated/prisma/client.js";
import { PrismaBatchMapper } from "@/infrastructure/prisma/batch/mapper.js";
import prisma from "@/lib/prisma.js";
import { newBatchFactory } from "@/testing/factories/batch.js";
import { userFactory } from "@/testing/factories/persisted/user.js";

// buildとcreateの責務を持つ。実際にDBへ保存するので、ドメイン層のテストからは使わない
export const batchFactory = Factory.define<NewBatchProps, unknown, BatchRecord>(
	({ onCreate, params }) => {
		onCreate(async (batch) => {
			// 呼び出し元のパターン:
			// - { triggeredBy: userId } → そのユーザーに紐付ける
			// - { triggeredBy: null }   → 自動実行バッチとして保存する
			// - 何も渡さない            → 新規ユーザーを自動作成して紐付ける
			const triggeredBy =
				params.triggeredBy !== undefined
					? params.triggeredBy
					: (await userFactory.create()).id;

			const data = PrismaBatchMapper.toCreatePersistence(
				Batch.create({ ...batch, triggeredBy }),
			);

			return prisma.batch.create({
				data,
			});
		});

		// デフォルト値はbuild専用のnewBatchFactoryから借りる（重複させない）
		return newBatchFactory.build();
	},
);
